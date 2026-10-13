'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ensureEcwidScript, initEcwidCartWidget } from '@/lib/ecwid-loader';

export default function EcwidCartWidget() {
  const { locale } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;
    const host = document.createElement('div');
    host.className = 'ec-cart-widget';
    host.dataset.layout = 'SIMPLE_ICON_COUNTER';
    container.appendChild(host);
    let cancelled = false;
    const timer = window.setTimeout(() => {
      ensureEcwidScript(locale)
        .then(() => {
          if (!cancelled && container.isConnected) {
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
      container.replaceChildren();
    };
  }, [locale]);

  return (
    <div
      ref={hostRef}
      className="ecwid-header-cart"
      aria-label="Shopping cart"
    />
  );
}
