'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getEcwidScriptUrl, siteConfig } from '@/lib/site-config';
import LoadingSpinner from './LoadingSpinner';

declare global {
  interface Window {
    xProductBrowser?: (...args: string[]) => void;
  }
}

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
  const scriptUrl = getEcwidScriptUrl(locale);

  useEffect(() => {
    setIsLoading(true);
    const container = document.getElementById(siteConfig.ecwidStoreElementId);
    if (container) {
      container.innerHTML = '';
    }

    if (window.xProductBrowser) {
      initEcwidStore();
      setIsLoading(false);
    }
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
      <Script
        id={`ecwid-script-${locale}`}
        src={scriptUrl}
        strategy="afterInteractive"
        onLoad={() => {
          initEcwidStore();
          setIsLoading(false);
        }}
      />
    </div>
  );
}
