'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ensureEcwidScript, initEcwidCartWidget } from '@/lib/ecwid-loader';
import ShopSafeLink from '@/components/ShopSafeLink';
import ShoppingBagIcon from '@/components/ShoppingBagIcon';
import { cacheCartQuantity, observeCartQuantity } from '@/lib/cart-quantity';

const cartLabels = { en: 'Shopping cart', es: 'Carrito', pl: 'Koszyk' };

export default function EcwidCartWidget({ initialQuantity = null }: { initialQuantity?: number | null }) {
  const { locale } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState<number | null>(initialQuantity);

  useEffect(() => {
    if (hostRef.current) return observeCartQuantity(hostRef.current, value => {
      setQuantity(value);
      cacheCartQuantity(value);
    });
  }, []);

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
      <ShoppingBagIcon />
      {quantity !== null && <>
        <span className={`header-cart-quantity${quantity > 99 ? ' header-cart-quantity--compact' : ''}`} aria-hidden="true">{quantity > 99 ? '99+' : quantity}</span>
        <span className="sr-only" role="status">{cartLabels[locale]}: {quantity}</span>
      </>}
      {/* Keep this React-owned link outside Ecwid's imperative host. It is
          available from the first render, including while Ecwid restarts. */}
      <ShopSafeLink
        href="/shop/cart"
        className="header-cart-fallback"
        aria-label={cartLabels[locale]}
      >
        <span className="sr-only">{cartLabels[locale]}</span>
      </ShopSafeLink>
      <div ref={hostRef} className="ecwid-header-cart" />
    </div>
  );
}
