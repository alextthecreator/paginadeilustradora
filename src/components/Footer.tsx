'use client';

import React from 'react';
import ShopSafeLink from './ShopSafeLink';
import { FaInstagram, FaBehance, FaLinkedinIn } from 'react-icons/fa';
import { trackEvent, analyticsConfig } from '@/lib/analytics';
import { cookieCopy } from '@/i18n/cookie-consent';
import { showCookiePreferences } from '@/lib/cookie-consent';
import { useLanguage } from '@/i18n/LanguageContext';
import { privacyCopy } from '@/i18n/privacy';

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
    <footer className="site-footer bg-[#02382e] w-full">
      <div className="footer-shell w-full">
        <div className="footer-top flex min-h-[132px] items-center justify-center lg:items-start lg:justify-between">
          <div className="text-center lg:text-left">
            <h3
              className="type-label font-mencken-bold mb-5 uppercase tracking-widest"
              style={{ color: '#f57692' }}
            >
              {t.footer.socials}
            </h3>
            <div className="footer-social-links flex justify-center gap-5 sm:gap-6">
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
                    style={{ color: '#f57692' }}
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

        <div className="footer-privacy mt-6 text-center" style={{ color: '#f57692' }}>
          <ShopSafeLink href="/privacy" className="inline-flex min-h-11 items-center px-3 text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{privacyCopy[locale].link}</ShopSafeLink>
        </div>
        <div className="footer-copyright type-label font-mencken-regular mt-10 py-4 text-center" style={{ color: '#f57692' }}>
          <p>{rightsText}</p>
          {brandText && <p className="mt-1">© {brandText}</p>}
        </div>
        <div className="footer-cookies mt-4 flex justify-center pb-4 text-center" style={{ color: '#f57692' }}>
          <button type="button" onClick={showCookiePreferences} className="min-h-[44px] px-3 text-sm lowercase underline underline-offset-4 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            {cookieCopy[locale].settings.toLocaleLowerCase(locale)}
          </button>
        </div>
      </div>
    </footer>
  );
}
