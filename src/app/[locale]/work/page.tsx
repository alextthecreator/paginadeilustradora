'use client';

import React, { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { FaChevronDown } from 'react-icons/fa';
import PotteryCollections from '@/components/PotteryCollections';
import { cloudinaryImages } from '@/data/cloudinary-images';
import { graphicPortfolio } from '@/data/graphic-portfolio';
import { useLanguage } from '@/i18n/LanguageContext';
import SkillBannerLinks from '@/components/SkillBannerLinks';
import { workSections, workSectionFromHash, type WorkSection } from '@/lib/work-sections';

const MACRAME_IMAGES = Object.values(cloudinaryImages.macrame);

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

function getGraphicMasonryUrl(src: string, maxWidthPx = 1800): string {
  if (!src.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return src;
  }

  const transforms = `f_auto,q_auto:best,c_limit,w_${maxWidthPx},dpr_auto`;
  return src.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transforms}/`);
}

const GRAPHIC_MASONRY_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

const GRAPHIC_GALLERY_GAP_PX = 10;

const GRAPHIC_ORDER_AFTER_HERO: readonly number[] = [
  1, 2, 3, 5, 4, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 8, 10, 9, 11, 12,
];


function PortfolioSection({ section, title, open, onToggle, headingRef, children }: {
  section: WorkSection; title: string; open: boolean; onToggle: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>; children: React.ReactNode;
}) {
  return <section className="work-content-section page-shell" data-open={open} aria-labelledby={section}>
    <h2 id={section} ref={headingRef} tabIndex={-1} className="work-section-title section-title font-temeraire-display">
      <span className="work-desktop-title">{title}</span>
      <button type="button" className="work-mobile-toggle" aria-expanded={open} aria-controls={`${section}-content`} onClick={onToggle}>
        <span>{title}</span><FaChevronDown aria-hidden="true" />
      </button>
    </h2>
    <div id={`${section}-content`} className="work-section-content">{children}</div>
  </section>;
}

export default function WorkPage() {
  const { t } = useLanguage();
  // Mobile accordions are independent: opening one never removes content above
  // another. Desktop displays all sections through CSS, without resize remounts.
  const [openSections, setOpenSections] = useState<Record<WorkSection, boolean>>({ graphic: true, pottery: false, macrame: false });
  const [active, setActive] = useState<WorkSection>('graphic');
  const pageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const graphicRef = useRef<HTMLHeadingElement>(null);
  const potteryRef = useRef<HTMLHeadingElement>(null);
  const macrameRef = useRef<HTMLHeadingElement>(null);
  const pendingScroll = useRef<number | null>(null);
  const navigationTarget = useRef<WorkSection | 'top' | null>(null);
  const navigationDeadline = useRef(0);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const page = pageRef.current;
    if (!nav || !page) return;
    const measure = () => page.style.setProperty('--work-navigation-height', `${nav.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  const navigateToHash = useEffectEvent(() => {
    if (window.location.hash === '#all' || window.location.hash === '#work-top') {
      if (window.location.hash === '#all') flushSync(() => setOpenSections({ graphic: true, pottery: true, macrame: true }));
      navigationTarget.current = 'top';
      navigationDeadline.current = Date.now() + 1800;
      if (pendingScroll.current !== null) cancelAnimationFrame(pendingScroll.current);
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      document.getElementById('work-top')?.focus({ preventScroll: true });
      setActive('graphic');
      return;
    }
    const section = workSectionFromHash(window.location.hash);
    if (!section) return;
    navigationTarget.current = section;
    navigationDeadline.current = Date.now() + 1800;
    flushSync(() => {
      setOpenSections(previous => ({ ...previous, [section]: true }));
      setActive(section);
    });
    if (pendingScroll.current !== null) cancelAnimationFrame(pendingScroll.current);
    pendingScroll.current = requestAnimationFrame(() => {
      pendingScroll.current = null;
      const heading = { graphic: graphicRef, pottery: potteryRef, macrame: macrameRef }[section].current;
      if (!heading) return;
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
      const nav = navRef.current?.getBoundingClientRect().height || 0;
      const top = Math.max(0, heading.getBoundingClientRect().top + window.scrollY - header - nav - 16);
      window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      heading.focus({ preventScroll: true });
    });
  });

  useEffect(() => {
    const apply = () => navigateToHash();
    const frame = requestAnimationFrame(apply);
    window.addEventListener('hashchange', apply);
    return () => {
      cancelAnimationFrame(frame);
      if (pendingScroll.current !== null) cancelAnimationFrame(pendingScroll.current);
      window.removeEventListener('hashchange', apply);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const boundary = (document.querySelector('.site-header')?.getBoundingClientRect().height || 0) + (navRef.current?.getBoundingClientRect().height || 0) + 32;
      const target = navigationTarget.current;
      if (target) {
        const distance = target === 'top' ? window.scrollY : Math.abs((document.getElementById(target)?.getBoundingClientRect().top ?? Infinity) - (boundary - 16));
        if (distance > 3 && Date.now() < navigationDeadline.current) return;
        navigationTarget.current = null;
      }
      let current: WorkSection = 'graphic';
      for (const section of workSections) {
        if ((document.getElementById(section)?.getBoundingClientRect().top ?? Infinity) <= boundary) current = section;
      }
      setActive(previous => previous === current ? previous : current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const interrupt = () => { navigationTarget.current = null; schedule(); };
    const interruptKey = (event: KeyboardEvent) => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) interrupt(); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', interruptKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      window.removeEventListener('wheel', interrupt); window.removeEventListener('touchstart', interrupt); window.removeEventListener('keydown', interruptKey);
    };
  }, []);

  const toggle = (section: WorkSection) => setOpenSections(previous => ({ ...previous, [section]: !previous[section] }));


  return <div ref={pageRef} className="work-page min-h-screen bg-brand-dark-teal w-full">
    <section className="page-shell"><h1 id="work-top" tabIndex={-1} className="section-title-pink font-temeraire-display text-center uppercase">{t.work.title}</h1></section>
    <nav ref={navRef} className="work-category-nav skills-section skills-section--compact page-shell" aria-label={t.nav.work}>
      <SkillBannerLinks active={active} />
    </nav>
    <PortfolioSection section="graphic" title={t.work.sections.graphic} open={openSections.graphic} onToggle={() => toggle('graphic')} headingRef={graphicRef}>
            <div className="flex flex-col">
              <div
                className="box-border block w-full leading-none"
                style={{ marginBottom: GRAPHIC_GALLERY_GAP_PX }}
              >
                <Image
                  src={getGraphicMasonryUrl(graphicPortfolio[0].src, 2560)}
                  alt="Graphic design piece 1 — Ilustración sin título 2"
                  width={graphicPortfolio[0].width}
                  height={graphicPortfolio[0].height}
                  className="block h-auto w-full max-w-full align-top"
                  sizes="100vw"
                  quality={85}
                  loading="eager"
                  priority
                  fetchPriority="high"
                  unoptimized
                />
              </div>

              <div
                className="columns-1 sm:columns-2 lg:columns-3 [&>*]:break-inside-avoid"
                style={{ columnGap: GRAPHIC_GALLERY_GAP_PX }}
              >
                {GRAPHIC_ORDER_AFTER_HERO.map((originalIndex, index) => {
                  const image = graphicPortfolio[originalIndex];
                  const isAboveFold = index < 4;
                  return (
                    <div
                      key={originalIndex}
                      className="box-border block w-full leading-none"
                      style={{ marginBottom: GRAPHIC_GALLERY_GAP_PX }}
                    >
                      <Image
                        src={getGraphicMasonryUrl(image.src)}
                        alt={`Graphic design piece ${originalIndex + 1}`}
                        width={image.width}
                        height={image.height}
                        className="block h-auto w-full max-w-full align-top"
                        sizes={GRAPHIC_MASONRY_SIZES}
                        quality={85}
                        loading={isAboveFold ? 'eager' : 'lazy'}
                        priority={isAboveFold}
                        fetchPriority={isAboveFold ? 'high' : 'auto'}
                        unoptimized
                      />
                    </div>
                  );
                })}
              </div>
            </div>
    </PortfolioSection>
    <PortfolioSection section="pottery" title={t.work.sections.pottery} open={openSections.pottery} onToggle={() => toggle('pottery')} headingRef={potteryRef}>
      <PotteryCollections />
    </PortfolioSection>
    <PortfolioSection section="macrame" title={t.work.sections.macrame} open={openSections.macrame} onToggle={() => toggle('macrame')} headingRef={macrameRef}>
            <div className="gallery-grid">
              {MACRAME_IMAGES.map((imagePath, index) => (
                <div
                  key={imagePath}
                  className="aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={getGraphicMasonryUrl(imagePath, 800)}
                    alt={`Macrame piece ${index + 1}`}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 767px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
    </PortfolioSection>

  </div>;
}
