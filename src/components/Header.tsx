'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import BrandLogo from './BrandLogo';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--site-header-height-px',
        `${Math.round(element.getBoundingClientRect().height)}px`
      );
    };

    syncHeaderHeight();

    const resizeObserver = new ResizeObserver(syncHeaderHeight);
    resizeObserver.observe(element);
    window.addEventListener('resize', syncHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncHeaderHeight);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems: NavItem[] = [
    { href: '/about', label: t.nav.about },
    { href: '/work', label: t.nav.work },
    { href: '/shop', label: t.nav.shop },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <header ref={headerRef} className="site-header bg-brand-dark-teal w-full">
      <div className="page-x flex h-20 w-full items-center justify-between pt-2 xl:h-32 xl:pt-5">
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link href="/" onClick={closeMobileMenu}>
            <BrandLogo size="2xl" showText={false} />
          </Link>
        </div>

        {/* Desktop Navigation & Icons */}
        <div className="header-nav-actions desktop-navigation">
          <nav className="flex min-w-0 items-center gap-8 2xl:gap-16">
            {navigationItems.map((item) => {
              const linkClassName =
                'type-nav whitespace-nowrap font-brand-bold transition-colors uppercase tracking-widest py-4';
              const linkStyle = { color: '#FF8A9D' };

              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                    style={linkStyle}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={linkClassName} style={linkStyle}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="header-utility-actions">
          <LanguageSwitcher />
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-toggle min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-white hover:bg-white/10 hover:text-brand-vibrant-pink transition-colors duration-300"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mobile-menu-panel fixed inset-x-0 bottom-0 top-[var(--site-header-height-px)] overflow-y-auto"
            >
              <div id="mobile-navigation" className="mobile-navigation-panel bg-brand-dark-teal/95 backdrop-blur-sm border-t border-brand-vibrant-pink/30 py-3">
                <nav className="flex flex-col space-y-2 pb-[env(safe-area-inset-bottom,0px)]">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMobileMenu}
                          className="block min-h-11 px-4 py-3 text-white hover:text-brand-vibrant-pink hover:bg-brand-vibrant-pink/20 transition-colors duration-300 text-base uppercase tracking-widest font-brand-bold rounded-lg mx-2 sm:text-lg"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="block min-h-11 px-4 py-3 text-white hover:text-brand-vibrant-pink hover:bg-brand-vibrant-pink/20 transition-colors duration-300 text-base uppercase tracking-widest font-brand-bold rounded-lg mx-2 sm:text-lg"
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  );
}
