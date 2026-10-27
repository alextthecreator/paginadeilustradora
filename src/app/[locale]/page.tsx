'use client';

import React from 'react';
import Link from '@/components/ShopSafeLink';
import Image, { type ImageLoaderProps } from 'next/image';
import InteractiveCarousel from '@/components/InteractiveCarousel';
import artwork from '@/data/artwork.json';
import { useLanguage } from '@/i18n/LanguageContext';
import WorkSectionLink from '@/components/WorkSectionLink';
import { skillSections } from '@/lib/work-sections';

const HOME_HERO_TRANSFORM = 'f_auto,q_auto,dpr_auto';
const HOME_HERO_PUBLIC_ID = 'v1783344408/Home_Picture_Toska_Website_onnmow.png';
const HOME_HERO_BASE = `https://res.cloudinary.com/dxpdn6xgr/image/upload`;

const getHomeHeroUrl = (width: number) =>
  `${HOME_HERO_BASE}/w_${width},${HOME_HERO_TRANSFORM}/${HOME_HERO_PUBLIC_ID}`;

const HOME_HERO_SOURCE = `${HOME_HERO_BASE}/${HOME_HERO_PUBLIC_ID}`;

const homeHeroLoader = ({ width }: ImageLoaderProps) => getHomeHeroUrl(width);


export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="home-page min-h-screen bg-brand-dark-teal w-full min-w-0 text-brand-light-text">
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


        <section className="home-work-section page-shell bg-brand-dark-teal w-full">
          <div className="home-work-heading text-center mb-[var(--layout-gap-xl)]">
            <h2 className="type-display font-brand-heading uppercase tracking-widest text-[#f57692]">
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
                  backgroundColor: '#ffdcbd',
                  color: '#004e42',
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
                <WorkSectionLink section={skillSections[index]}
                  className="skills-text type-skills lowercase text-[#ffdcbd]"
                >
                  {tag}
                </WorkSectionLink>
                {index < arr.length - 1 && (
                  <span
                  className="work-skills-separator text-[#ffdcbd]/50"
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
