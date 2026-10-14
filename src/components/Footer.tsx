'use client';

import React from 'react';
import ShopSafeLink from './ShopSafeLink';
import { FaInstagram, FaBehance, FaLinkedinIn } from 'react-icons/fa';
import { trackEvent, analyticsConfig } from '@/lib/analytics';
import { cookieCopy } from '@/i18n/cookie-consent';
import { showCookiePreferences } from '@/lib/cookie-consent';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Footer() {
  const { t, locale } = useLanguage();
  const [rightsText, brandText] = t.footer.copyright.split(' © ');

  const socialLinks = [
    { href: "https://www.instagram.com/toska_cr/?hl=en", icon: FaInstagram },
    { href: "https://www.behance.net/GlorianaSanabria", icon: FaBehance },
    { href: "https://www.linkedin.com/in/gloriana-sanabria-chac%C3%B3n/", icon: FaLinkedinIn },
  ];

  const navLinks = [
    { href: '/work', label: t.nav.work },
    { href: '/about', label: t.nav.about },
    { href: '/shop', label: t.nav.shop },
    { href: '/calendar', label: t.nav.calendar },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="site-footer bg-[#0f2e1f] w-full">
      <div className="footer-shell w-full">
        <div className="flex min-h-[132px] items-center justify-center lg:items-start lg:justify-between">
          <div className="text-center lg:text-left">
            <h3
              className="type-label font-mencken-bold mb-5 uppercase tracking-widest"
              style={{ color: '#FF8A9D' }}
            >
              {t.footer.socials}
            </h3>
            <div className="flex justify-center gap-5 sm:gap-6">
              {socialLinks.map(({ href, icon: Icon }) => {
                const platform = href.includes('instagram') ? 'Instagram' : href.includes('behance') ? 'Behance' : 'LinkedIn';
                const eventName = href.includes('instagram') ? analyticsConfig.events.INSTAGRAM_CLICK :
                                 href.includes('behance') ? analyticsConfig.events.BEHANCE_CLICK :
                                 analyticsConfig.events.LINKEDIN_CLICK;

                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:opacity-80"
                    style={{ color: '#FF8A9D' }}
                    aria-label={`Follow Toska CR on ${platform}`}
                    onClick={() => {
                      trackEvent(eventName, {
                        platform: platform.toLowerCase(),
                        link_url: href,
                        page_location: window.location.href,
                      });
                    }}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav className="hidden text-right lg:block" aria-label="Footer navigation">
            {navLinks.map(({ href, label }) => (
              <ShopSafeLink
                key={href}
                href={href}
                className="footer-nav-link type-nav font-mencken-bold text-brand-vibrant-pink transition-colors uppercase tracking-widest"
              >
                {label}
              </ShopSafeLink>
            ))}
          </nav>

        </div>

        <div className="footer-copyright type-label font-mencken-regular mt-10 py-4 text-center" style={{ color: '#FF8A9D' }}>
          <p>{rightsText}</p>
          {brandText && <p className="mt-1">© {brandText}</p>}
        </div>
        <div className="mt-4 flex justify-center pb-4 text-center" style={{ color: '#FF8A9D' }}>
          <button type="button" onClick={showCookiePreferences} className="min-h-[44px] px-3 text-sm lowercase underline underline-offset-4 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            {cookieCopy[locale].settings.toLocaleLowerCase(locale)}
          </button>
        </div>
      </div>
    </footer>
  );
}
