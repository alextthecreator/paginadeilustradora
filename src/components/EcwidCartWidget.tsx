'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ensureEcwidScript, initEcwidCartWidget } from '@/lib/ecwid-loader';
import ShopSafeLink from '@/components/ShopSafeLink';

const cartLabels = { en: 'Shopping cart', es: 'Carrito', pl: 'Koszyk' };

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
    <div className="header-cart-shell">
      {/* Keep this React-owned link outside Ecwid's imperative host. It is
          available from the first render, including while Ecwid restarts. */}
      <ShopSafeLink
        href="/shop/cart"
        className="header-cart-fallback"
        aria-label={cartLabels[locale]}
      >
        <svg width="36" height="30" viewBox="0 0 36 30" aria-hidden="true" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 7h22v18a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V7z" />
            <path d="M13 10V6c0-2.993 2.009-5 5-5s5 2.026 5 5v4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </ShopSafeLink>
      <div ref={hostRef} className="ecwid-header-cart" />
    </div>
  );
}
