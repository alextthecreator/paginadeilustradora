'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { isShopPath } from '@/lib/shop-path';

/** Next may align the new page with the viewport behind our fixed header.
 * Fresh page navigation starts at the document top; history and section links
 * retain their own scroll restoration, as does Ecwid inside the store. */
export default function RouteScrollReset() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const historyPath = useRef<string | null>(null);

  useEffect(() => {
    const restore = () => { historyPath.current = window.location.pathname; };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const restoring = historyPath.current === pathname;
    historyPath.current = null;
    if (restoring || window.location.hash || isShopPath(pathname)) return;
    // Cancel any root smooth scroll started by Next's automatic positioning.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
