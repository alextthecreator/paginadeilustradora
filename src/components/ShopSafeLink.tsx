'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, type AnchorHTMLAttributes } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { prepareCartForNavigation } from '@/lib/ecwid-cart-navigation';

function isShopPath(path: string) {
  return path.split(/[?#]/)[0].replace(/\/$/, '') === '/shop';
}

export function needsDocumentNavigation(pathname: string, href: string) {
  return isShopPath(pathname) || isShopPath(href);
}

const copy = {
  en: { saving: 'Saving your cart…', error: 'Your cart could not be confirmed. Please try again.' },
  es: { saving: 'Guardando tu carrito…', error: 'No se pudo confirmar tu carrito. Inténtalo de nuevo.' },
  pl: { saving: 'Zapisuję koszyk…', error: 'Nie udało się potwierdzić koszyka. Spróbuj ponownie.' },
};

/** Cross the shop boundary with document navigation: Ecwid's metadata manager
 * can remove Next-owned head nodes. Confirm the cart before leaving the shop.
 */
export default function ShopSafeLink({ href, onClick, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const inFlight = useRef(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  if (!needsDocumentNavigation(pathname, href)) return <Link href={href} onClick={onClick} {...props}>{children}</Link>;
  return (
    <a href={href} {...props} aria-busy={status === 'saving'} onClick={(event) => {
      if (event.defaultPrevented) return;
      if (!isShopPath(pathname) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') {
        onClick?.(event);
        return;
      }
      event.preventDefault();
      if (inFlight.current) return;
      inFlight.current = true;
      setStatus('saving');
      prepareCartForNavigation().then(() => {
        onClick?.(event);
        window.location.assign(href);
      }).catch(() => {
        inFlight.current = false;
        setStatus('error');
      });
    }}>
      {children}
      {status !== 'idle' && <span role={status === 'error' ? 'alert' : 'status'} className="block text-sm normal-case tracking-normal">{copy[locale][status]}</span>}
    </a>
  );
}
