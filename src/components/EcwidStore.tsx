'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ensureEcwidScript } from '@/lib/ecwid-loader';
import { siteConfig } from '@/lib/site-config';
import LoadingSpinner from './LoadingSpinner';

const ECWID_OPTIONS = [
  'categoriesPerRow=3',
  'views=grid(20,3) list(60) table(60)',
  'categoryView=grid',
  'searchView=list',
  `id=${siteConfig.ecwidStoreElementId}`,
];

function initEcwidStore() {
  window.xProductBrowser?.(...ECWID_OPTIONS);
}

export default function EcwidStore() {
  const { locale } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const container = document.getElementById(siteConfig.ecwidStoreElementId);
    if (container) {
      container.innerHTML = '';
    }

    ensureEcwidScript(locale)
      .then(() => {
        if (cancelled) return;
        initEcwidStore();
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="ecwid-store-shell" key={locale}>
      {isLoading && (
        <LoadingSpinner
          size="lg"
          text="Loading shop..."
          className="ecwid-store-loading py-16"
        />
      )}
      <div id={siteConfig.ecwidStoreElementId} />
    </div>
  );
}
