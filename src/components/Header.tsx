'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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
  const { t } = useLanguage();

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
    <header className="bg-brand-dark-teal w-full sticky top-0 z-50">
      <div className="w-full flex items-center justify-between h-32" style={{ paddingLeft: '100px', paddingRight: '100px', paddingTop: '20px' }}>
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link href="/" onClick={closeMobileMenu}>
            <BrandLogo size="2xl" showText={false} />
          </Link>
        </div>

        {/* Desktop Navigation & Icons */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-16">
            {navigationItems.map((item) => {
              const linkClassName =
                'font-brand-bold transition-colors uppercase tracking-widest';
              const linkStyle = {
                color: '#FF8A9D',
                fontSize: '25px',
                fontWeight: 800,
                paddingTop: '1rem',
                paddingBottom: '1rem',
                justifyContent: 'right',
              };

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
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClassName}
                  style={linkStyle}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Language Switcher */}
          <div style={{ paddingLeft: '60px' }}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-white hover:text-brand-vibrant-pink transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-brand-dark-teal/95 backdrop-blur-sm border-t border-brand-vibrant-pink/30 py-6">
                <nav className="flex flex-col space-y-4">
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
                          className="block px-4 py-3 text-white hover:text-brand-vibrant-pink hover:bg-brand-vibrant-pink/20 transition-colors duration-300 text-lg uppercase tracking-widest font-brand-bold rounded-lg mx-2"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-white hover:text-brand-vibrant-pink hover:bg-brand-vibrant-pink/20 transition-colors duration-300 text-lg uppercase tracking-widest font-brand-bold rounded-lg mx-2"
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  <LanguageSwitcher variant="list" onSelect={closeMobileMenu} />
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  );
}
