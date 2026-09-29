'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ensureEcwidScript, initEcwidCartWidget } from '@/lib/ecwid-loader';

export default function EcwidCartWidget() {
  const { locale } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      ensureEcwidScript(locale)
        .then(() => {
          if (!cancelled && hostRef.current) {
            initEcwidCartWidget();
          }
        })
        .catch(() => {
          /* non-blocking */
        });
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [locale]);

  return (
    <div
      ref={hostRef}
      className="ec-cart-widget ecwid-header-cart"
      data-layout="SIMPLE_ICON_COUNTER"
      aria-label="Shopping cart"
    />
  );
}
