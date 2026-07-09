'use client';

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaBehance, FaLinkedinIn } from 'react-icons/fa';
import { trackEvent, analyticsConfig } from '@/lib/analytics';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { href: "https://www.instagram.com/toska_cr/?hl=en", icon: FaInstagram },
    { href: "https://www.behance.net/GlorianaSanabria", icon: FaBehance },
    { href: "https://www.linkedin.com/in/gloriana-sanabria-chac%C3%B3n/", icon: FaLinkedinIn },
  ];

  const navLinks = [
    { href: "/work", label: t.nav.work },
    { href: "/about", label: t.nav.about },
    { href: "/shop", label: t.nav.shop },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-[#0f2e1f] w-full">
      <div className="w-full py-20" style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '80px', paddingRight: '80px' }}>
        <div className="flex flex-col md:flex-row justify-between items-center min-h-[160px]">
          {/* Socials */}
          <div className="text-left mb-8 md:mb-0">
            <h3 
              className="font-mencken-bold uppercase tracking-widest text-2xl pb-5"
              style={{ color: '#FF8A9D', fontSize: '25px', marginBottom: '20px' }}
            >
              {t.footer.socials}
            </h3>
            <div className="flex justify-center md:justify-start gap-12">
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
                    <Icon size={36} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="text-right">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-mencken-bold block mb-1 transition-colors uppercase tracking-widest"
                style={{ color: '#FF8A9D', fontSize: '25px', paddingBottom: '10px' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Copyright */}
        <div 
          className="font-mencken-regular text-center pt-8 pb-8 mt-12"
          style={{ color: '#FF8A9D', marginLeft: '80px', marginRight: '80px', fontSize: '25px' }}
        >
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
