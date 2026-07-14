'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguagesIcon } from './BrandLogo';
import { useLanguage } from '@/i18n/LanguageContext';
import { Locale, localeFlagEmoji, localeFlags, locales } from '@/i18n';

interface LanguageSwitcherProps {
  onSelect?: () => void;
  variant?: 'dropdown' | 'list';
}

const HOVER_CLOSE_DELAY = 180;
/** Odstęp między ikoną globusa a panelem języków (px) — zmień tutaj */
const MENU_GAP_PX = 16;

function FlagImage({ locale }: { locale: Locale }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <span className="text-2xl leading-none" aria-hidden="true">
        {localeFlagEmoji[locale]}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={localeFlags[locale]}
      alt=""
      width={36}
      height={27}
      onError={() => setImageError(true)}
    />
  );
}

function LanguageOption({
  code,
  label,
  isSelected,
  onSelect,
  size = 'dropdown',
  index = 0,
}: {
  code: Locale;
  label: string;
  isSelected: boolean;
  onSelect: (code: Locale) => void;
  size?: 'dropdown' | 'list';
  index?: number;
}) {
  const isLarge = size === 'dropdown';

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(code)}
      initial={isLarge ? { opacity: 0, x: 8 } : false}
      animate={isLarge ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.3, delay: isLarge ? index * 0.06 : 0, ease: [0.4, 0, 0.2, 1] }}
      className={`language-switcher-option font-brand-bold uppercase tracking-widest transition-colors duration-300 ease-out ${
        size === 'list' ? 'language-switcher-option--list rounded-xl' : 'rounded-2xl'
      } ${
        isSelected
          ? 'bg-[#FBEAD5] text-[#1a4d3a] shadow-md'
          : 'bg-transparent text-[#FBEAD5] hover:bg-[#FF8A9D]/20 hover:text-[#FF8A9D]'
      }`}
      style={{ fontWeight: 800 }}
    >
      <span className="language-switcher-flag">
        <FlagImage locale={code} />
      </span>
      <span className="text-base sm:text-lg md:text-2xl">{label}</span>
    </motion.button>
  );
}

export default function LanguageSwitcher({
  onSelect,
  variant = 'dropdown',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const closeMenu = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, HOVER_CLOSE_DELAY);
  };

  const handleSelect = (nextLocale: Locale) => {
    setLocale(nextLocale);
    setIsOpen(false);
    onSelect?.();
  };

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    openMenu();
  };

  if (variant === 'list') {
    return (
      <div className="language-switcher-panel mx-3 mt-3 rounded-2xl border border-[#FF8A9D]/30 bg-[#0f2e1f]/80">
        <div className="language-switcher-list">
          {locales.map((code, index) => (
            <LanguageOption
              key={code}
              code={code}
              label={t.language[code]}
              isSelected={locale === code}
              onSelect={handleSelect}
              size="list"
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="language-switcher-root relative"
      style={{ ['--language-switcher-menu-gap' as string]: `${MENU_GAP_PX}px` }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          openMenu();
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') {
          closeMenu();
        }
      }}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          closeMenu();
        }
      }}
    >
      <div
        className="cursor-pointer rounded-full p-1 transition-all duration-300 ease-out hover:opacity-90"
        aria-label="Language selector"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="button"
        tabIndex={0}
        onClick={toggleMenu}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
          }

          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <LanguagesIcon />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="language-switcher-dropdown"
            style={{ top: `calc(100% + ${MENU_GAP_PX}px)` }}
          >
            <div
              className="language-switcher-panel min-w-[320px] rounded-2xl border-2 border-[#FF8A9D]/40 bg-[#0f2e1f] shadow-2xl"
              role="listbox"
              aria-label="Language selector"
            >
              <div className="language-switcher-list">
              {locales.map((code, index) => (
                <LanguageOption
                  key={code}
                  code={code}
                  label={t.language[code]}
                  isSelected={locale === code}
                  onSelect={handleSelect}
                  size="dropdown"
                  index={index}
                />
              ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
