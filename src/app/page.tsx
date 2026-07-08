'use client';

import React from 'react';
import Link from 'next/link';
import InteractiveCarousel from '@/components/InteractiveCarousel';
import artwork from '@/data/artwork.json';

const HOME_HERO_TRANSFORM = 'f_auto,q_auto,dpr_auto';
const HOME_HERO_PUBLIC_ID = 'v1783344408/Home_Picture_Toska_Website_onnmow.png';
const HOME_HERO_BASE = `https://res.cloudinary.com/dxpdn6xgr/image/upload`;

const getHomeHeroUrl = (width: number) =>
  `${HOME_HERO_BASE}/w_${width},${HOME_HERO_TRANSFORM}/${HOME_HERO_PUBLIC_ID}`;

const HOME_HERO_IMAGE = getHomeHeroUrl(1920);
const HOME_HERO_SRC_SET = [
  `${getHomeHeroUrl(640)} 640w`,
  `${getHomeHeroUrl(1024)} 1024w`,
  `${getHomeHeroUrl(1536)} 1536w`,
  `${getHomeHeroUrl(1920)} 1920w`,
  `${getHomeHeroUrl(2560)} 2560w`,
].join(', ');

/* eslint-disable react/no-unescaped-entities */

export default function Home() {

  return (
    <div className="min-h-screen bg-brand-dark-teal w-full min-w-0 text-brand-light-text">
      <main className="w-full min-w-0">
        <div className="home-hero-shell">
          <div className="home-hero">
            <img
              src={HOME_HERO_IMAGE}
              srcSet={HOME_HERO_SRC_SET}
              sizes="(max-width: 1660px) calc(100vw - 48px), 1600px"
              alt="Toska CR - handcrafted ceramics and artisan work"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>


        {/* My Work Section - Matching reference exactly */}
        <section className="bg-brand-dark-teal py-20 w-full" style={{ paddingTop: '40px', marginBottom: 0 }}>
          <div className="w-full" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
            <div className="text-center mb-12" style={{ paddingBottom: '40px' }}>
              <h2 
                className="font-brand-heading uppercase tracking-widest"
                style={{ 
                  fontSize: '60px',
                  color: '#FF8A9D',
                  fontWeight: 800
                }}
              >
                My Work
              </h2>
            </div>
            
            <InteractiveCarousel artwork={artwork} />
            
            <div className="text-center" style={{ marginTop: '80px', marginBottom: '40px' }}>
              <Link 
                href="/work"
                className="inline-block rounded-full font-brand-bold uppercase tracking-widest hover:bg-white transition-colors"
                style={{ 
                  borderRadius: '50px',
                  fontSize: '20px',
                  backgroundColor: '#FBEAD5',
                  color: '#1a4d3a',
                  padding: '20px 40px',
                  fontWeight: '900'
                }}
              >
                See All
              </Link>
            </div>
          </div>
        </section>

        {/* Skills List Section - Pink background with light cream text */}
        <section className="w-full" style={{ backgroundColor: '#FF8A9D', paddingTop: '40px', paddingBottom: '40px', paddingLeft: '30px', paddingRight: '30px', margin: 0 }}>
          <div className="w-full">
            <div className="flex justify-center items-center gap-x-12">
              {[
                "graphic design", "illustration", "pottery", "macramé"
              ].map((tag, index, arr) => (
                <React.Fragment key={tag}>
                  <span 
                    className="skills-text lowercase" 
                    style={{ 
                      fontSize: '40px',
                      lineHeight: '1',
                      color: '#FBEAD5'
                    }}
                  >
                    {tag}
                  </span>
                  {index < arr.length - 1 && (
                    <span 
                      className="skills-text text-brand-cream/50" 
                      style={{ 
                        fontSize: '40px',
                        lineHeight: '1'
                      }}
                    >•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
