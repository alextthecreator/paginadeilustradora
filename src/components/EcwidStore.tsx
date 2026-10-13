'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  ensureEcwidScript,
  initEcwidStore,
  releaseEcwidStore,
} from '@/lib/ecwid-loader';
import { siteConfig } from '@/lib/site-config';
import LoadingSpinner from './LoadingSpinner';

const ECWID_OPTIONS = [
  'categoriesPerRow=3',
  'views=grid(20,3) list(60) table(60)',
  'categoryView=grid',
  'searchView=list',
  `id=${siteConfig.ecwidStoreElementId}`,
];

export default function EcwidStore() {
  const { locale } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // React owns the outer container. Ecwid alone owns the imperatively created
  // host and its descendants, including when it replaces/removes those nodes.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const host = document.createElement('div');
    host.id = siteConfig.ecwidStoreElementId;
    container.appendChild(host);
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    ensureEcwidScript(locale)
      .then(() => {
        if (cancelled || !host.isConnected) return;
        initEcwidStore(host, ECWID_OPTIONS);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      releaseEcwidStore(host);
      // Removing an already detached host is safe; React never reconciles it.
      host.remove();
    };
  }, [locale]);

  return (
    <div className="ecwid-store-shell" aria-busy={isLoading}>
      {isLoading && (
        <LoadingSpinner
          size="lg"
          text="Loading shop..."
          className="ecwid-store-loading py-16"
        />
      )}
      {hasError && (
        <div role="alert" className="py-8 text-[#FBEAD5]">
          <p>{locale === 'pl' ? 'Nie udało się załadować sklepu.' : locale === 'es' ? 'No se pudo cargar la tienda.' : 'The shop could not be loaded.'}</p>
          <button type="button" className="mt-4 rounded-lg border px-4 py-3" onClick={() => window.location.reload()}>
            {locale === 'pl' ? 'Załaduj ponownie' : locale === 'es' ? 'Volver a cargar' : 'Reload page'}
          </button>
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
