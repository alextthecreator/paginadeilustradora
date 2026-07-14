'use client';

import React from 'react';
import Link from 'next/link';
import Image, { type ImageLoaderProps } from 'next/image';
import InteractiveCarousel from '@/components/InteractiveCarousel';
import artwork from '@/data/artwork.json';
import { useLanguage } from '@/i18n/LanguageContext';

const HOME_HERO_TRANSFORM = 'f_auto,q_auto,dpr_auto';
const HOME_HERO_PUBLIC_ID = 'v1783344408/Home_Picture_Toska_Website_onnmow.png';
const HOME_HERO_BASE = `https://res.cloudinary.com/dxpdn6xgr/image/upload`;

const getHomeHeroUrl = (width: number) =>
  `${HOME_HERO_BASE}/w_${width},${HOME_HERO_TRANSFORM}/${HOME_HERO_PUBLIC_ID}`;

const HOME_HERO_SOURCE = `${HOME_HERO_BASE}/${HOME_HERO_PUBLIC_ID}`;

const homeHeroLoader = ({ width }: ImageLoaderProps) => getHomeHeroUrl(width);

/* eslint-disable react/no-unescaped-entities */

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-brand-dark-teal w-full min-w-0 text-brand-light-text">
      <main className="w-full min-w-0">
        <div className="home-hero-shell">
          <div className="home-hero">
            <Image
              loader={homeHeroLoader}
              src={HOME_HERO_SOURCE}
              sizes="(max-width: 1660px) calc(100vw - 48px), 1600px"
              alt={t.home.heroAlt}
              width={5200}
              height={3200}
              priority
            />
          </div>
        </div>


        <section className="page-shell bg-brand-dark-teal w-full">
          <div className="text-center mb-[var(--layout-gap-xl)]">
            <h2 className="type-display font-brand-heading uppercase tracking-widest text-[#FF8A9D]">
              {t.home.myWork}
            </h2>
          </div>

          <InteractiveCarousel artwork={artwork} />

          <div className="home-see-all-container text-center">
              <Link
                href="/work"
                className="home-see-all inline-block rounded-full text-base font-brand-bold uppercase tracking-widest transition-colors hover:bg-white sm:text-xl"
                style={{
                  borderRadius: '50px',
                  backgroundColor: '#FBEAD5',
                  color: '#1a4d3a',
                  fontWeight: 900,
                }}
              >
                {t.home.seeAll}
              </Link>
            </div>
        </section>

        <section className="skills-section skills-section--compact page-shell">
          <div className="skills-row work-skills-row">
            {t.home.skills.map((tag, index, arr) => (
              <React.Fragment key={tag}>
                <span
                  className="skills-text type-skills lowercase text-[#FBEAD5]"
                >
                  {tag}
                </span>
                {index < arr.length - 1 && (
                  <span
                  className="work-skills-separator text-[#FBEAD5]/50"
                  >
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
