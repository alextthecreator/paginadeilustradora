'use client';

import { useLayoutEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  destroyEcwidSafely,
  ensureEcwidScript,
  initEcwidCartWidget,
  reinitEcwidCartSoon,
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

function initEcwidStore() {
  window.xProductBrowser?.(...ECWID_OPTIONS);
}

export default function EcwidStore() {
  const { locale } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  // useLayoutEffect so Ecwid.destroy runs BEFORE React removes DOM nodes.
  useLayoutEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    ensureEcwidScript(locale)
      .then(() => {
        if (cancelled) return;
        destroyEcwidSafely();
        initEcwidStore();
        initEcwidCartWidget();
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      destroyEcwidSafely();
      reinitEcwidCartSoon();
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
