'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { getPageSeo } from '@/lib/seo-config';
import { isShopPath, pageTransitionKey } from '@/lib/shop-path';
import { stripLocale } from '@/i18n/paths';
import { useLanguage } from '@/i18n/LanguageContext';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Enter-only fade keeps outgoing route removal under React's control.
 * Third-party widget nodes are managed separately by their owning components.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();

  useEffect(() => {
    if (isShopPath(pathname)) return;
    // Ecwid changes document.title for product/cart pages. On ordinary routes,
    // preserve the title defined by our existing Next metadata instead.
    const route = stripLocale(pathname);
    const page = route.slice(1);
    let title: string;
    if (route === '/') {
      title = getPageSeo('home', locale).title;
    } else if (page === 'about' || page === 'work' || page === 'calendar' || page === 'contact') {
      title = getPageSeo(page, locale).title;
    } else {
      // Artwork detail and unknown routes retain Next's own metadata handling.
      return;
    }
    const restoreTitle = () => {
      if (document.title !== title) document.title = title;
    };
    restoreTitle();
    const observer = new MutationObserver(restoreTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname, locale]);

  return (
    <motion.div
      key={pageTransitionKey(pathname)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="site-page w-full min-w-0"
    >
      {children}
    </motion.div>
  );
}
