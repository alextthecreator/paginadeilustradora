'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ensureEcwidScript, initEcwidCartWidget } from '@/lib/ecwid-loader';

export default function EcwidCartWidget() {
  const { locale } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Defer slightly so page transitions can finish DOM swaps first.
    timer = setTimeout(() => {
      ensureEcwidScript(locale)
        .then(() => {
          if (!cancelled && hostRef.current) {
            initEcwidCartWidget();
          }
        })
        .catch(() => {
          /* cart widget is non-blocking */
        });
    }, 50);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
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
