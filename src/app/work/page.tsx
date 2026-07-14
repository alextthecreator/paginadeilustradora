'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";
import PotteryCollections from "@/components/PotteryCollections";
import { cloudinaryImages } from "@/data/cloudinary-images";
import { potteryCollections } from "@/data/pottery-collections";
import { useLanguage } from "@/i18n/LanguageContext";

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

const WORK_SECTION_CONTENT_EASE = [0.16, 1, 0.3, 1] as const;

const WORK_ARROW_TRANSITION = {
  duration: 0.45,
  ease: WORK_SECTION_CONTENT_EASE,
};

const SECTION_LAYOUT_MS = 550;

const GRAPHIC_ORDER_AFTER_HERO: readonly number[] = [
  1, 2, 3, 5, 4, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 8, 10, 9, 11, 12,
];

type WorkSection = 'graphic' | 'pottery' | 'macrame';
type HeaderScrollPosition = 'in-view' | 'above' | 'below';
type SectionNavSource = 'top' | 'bottom' | 'header';

const WORK_SECTION_ORDER: WorkSection[] = ['graphic', 'pottery', 'macrame'];

function getCompactStickyBarHeightPx(): number {
  const topNav = document.querySelector('.work-sticky-nav-top');
  if (topNav) {
    const bar = topNav.querySelector('.work-sticky-nav-bar');
    if (bar) {
      return Math.round(bar.getBoundingClientRect().height);
    }
  }

  const bar = document.querySelector('.work-sticky-nav-bar');
  if (bar) {
    return Math.round(bar.getBoundingClientRect().height);
  }

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--work-sticky-nav-bar-height')
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 48;
}

function getTopStickyNavHeightPx(): number {
  const topNav = document.querySelector('.work-sticky-nav-top');
  return topNav ? Math.round(topNav.getBoundingClientRect().height) : 0;
}

function getBottomStickyNavHeightPx(): number {
  const bottomNav = document.querySelector('.work-floating-nav');
  return bottomNav ? Math.round(bottomNav.getBoundingClientRect().height) : 0;
}

const SECTION_HEADER_CLEARANCE_PX = 26;

function getFixedTopBoundaryPx(): number {
  const siteHeaderEl = document.querySelector('.site-header');
  const topNavEl = document.querySelector('.work-sticky-nav-top');

  const headerBottom = siteHeaderEl
    ? Math.round(siteHeaderEl.getBoundingClientRect().bottom)
    : getSiteHeaderHeightPx();
  const stickyBottom = topNavEl
    ? Math.round(topNavEl.getBoundingClientRect().bottom)
    : headerBottom;

  return Math.max(headerBottom, stickyBottom);
}

function getScrollOffsetPxForSection(
  section: WorkSection,
  _topStickySections: WorkSection[]
): number {
  const sectionIndex = WORK_SECTION_ORDER.indexOf(section);
  const expectedStickyBoundary =
    getSiteHeaderHeightPx() + Math.max(0, sectionIndex) * getCompactStickyBarHeightPx();

  return Math.max(getFixedTopBoundaryPx(), expectedStickyBoundary) + SECTION_HEADER_CLEARANCE_PX;
}

function getSiteHeaderHeightPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--site-header-height-px')
    .trim();
  const parsed = parseInt(raw, 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;

  const fallback = getComputedStyle(document.documentElement)
    .getPropertyValue('--header-sticky-offset-px')
    .trim();
  const fallbackParsed = parseInt(fallback, 10);
  return Number.isFinite(fallbackParsed) ? fallbackParsed : 144;
}

function isSectionHeaderAligned(
  section: WorkSection,
  refs: Record<WorkSection, React.RefObject<HTMLButtonElement | null>>,
  topStickySections: WorkSection[]
): boolean {
  const element = refs[section].current;
  if (!element) return false;

  const targetTop = getScrollOffsetPxForSection(section, topStickySections);
  const rect = element.getBoundingClientRect();

  return Math.abs(rect.top - targetTop) <= 4;
}

function needsScrollToSectionHeader(
  section: WorkSection,
  refs: Record<WorkSection, React.RefObject<HTMLButtonElement | null>>,
  topStickySections: WorkSection[]
): boolean {
  const element = refs[section].current;
  if (!element) return true;
  if (isSectionHeaderAligned(section, refs, topStickySections)) return false;

  const rect = element.getBoundingClientRect();
  const siteHeader = getSiteHeaderHeightPx();

  return rect.top >= window.innerHeight - 48 || rect.bottom <= siteHeader;
}

function scrollToSectionHeader(
  ref: React.RefObject<HTMLElement | null>,
  section: WorkSection,
  topStickySections: WorkSection[],
  targetTop?: number,
  behavior: ScrollBehavior = 'smooth'
) {
  const element = ref.current;
  if (!element) return;

  const top = targetTop ?? Math.max(
    0,
    element.getBoundingClientRect().top +
      window.scrollY -
      getScrollOffsetPxForSection(section, topStickySections)
  );
  window.scrollTo({ top, behavior });
}

function getAnchorLinePx(
  section: WorkSection,
  positions: Record<WorkSection, HeaderScrollPosition>
): number {
  const siteTop = getSiteHeaderHeightPx();
  const barHeight = getCompactStickyBarHeightPx();
  const sectionIndex = WORK_SECTION_ORDER.indexOf(section);
  const barsAbove = WORK_SECTION_ORDER.slice(0, sectionIndex).filter(
    (s) => positions[s] === 'above'
  ).length;

  return siteTop + barsAbove * barHeight;
}

function readAnchorZone(
  ref: React.RefObject<HTMLElement | null>,
  section: WorkSection,
  positions: Record<WorkSection, HeaderScrollPosition>,
  previous: boolean
): boolean {
  const element = ref.current;
  if (!element) return previous;

  const anchorLine = getAnchorLinePx(section, positions);
  const rect = element.getBoundingClientRect();
  const enterThreshold = 6;
  const exitThreshold = 18;

  if (previous) {
    return rect.top <= anchorLine + exitThreshold && rect.bottom > anchorLine - 14;
  }

  return rect.top <= anchorLine + enterThreshold && rect.bottom > anchorLine - 4;
}

function resolveTopStickySections(
  positions: Record<WorkSection, HeaderScrollPosition>,
  anchorZones: Record<WorkSection, boolean>
): WorkSection[] {
  return WORK_SECTION_ORDER.filter((section) => {
    if (anchorZones[section]) return false;
    return positions[section] === 'above';
  });
}

function useHeaderScrollPosition(
  ref: React.RefObject<HTMLElement | null>,
  refreshKey: number
) {
  const [position, setPosition] = useState<HeaderScrollPosition>('in-view');

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    let latest: HeaderScrollPosition = 'in-view';

    const readPosition = (): HeaderScrollPosition => {
      const stickyTop = getSiteHeaderHeightPx();
      const rect = element.getBoundingClientRect();

      if (rect.bottom <= stickyTop) return 'above';
      if (rect.top >= window.innerHeight) return 'below';
      return 'in-view';
    };

    const commit = () => {
      frame = 0;
      const next = readPosition();
      if (next !== latest) {
        latest = next;
        setPosition(next);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(commit);
    };

    latest = readPosition();
    setPosition(latest);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, refreshKey]);

  return position;
}

type WorkStickyBarProps = {
  title: string;
  isOpen: boolean;
  onNavigate: () => void;
};

function WorkStickyBar({ title, isOpen, onNavigate }: WorkStickyBarProps) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="work-sticky-nav-bar"
      aria-expanded={isOpen}
    >
      <h2 className="work-sticky-nav-title font-temeraire-display">{title}</h2>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={WORK_ARROW_TRANSITION}
        className="shrink-0"
        style={{ color: '#FF8A9D' }}
      >
        <FaArrowDown size={28} />
      </motion.div>
    </button>
  );
}

type WorkSectionPanelProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

function WorkSectionPanel({ isOpen, children }: WorkSectionPanelProps) {
  const [hasOpened, setHasOpened] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  return (
    <div className="work-section-panel" data-open={isOpen} aria-hidden={!isOpen}>
      <div className="work-section-panel-inner">
        {hasOpened ? (
          <div className="work-section-panel-content">{children}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function WorkPage() {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<WorkSection | null>('graphic');
  const [layoutRevision, setLayoutRevision] = useState(0);

  const bumpLayoutRevision = () => {
    setLayoutRevision((value) => value + 1);
  };

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(bumpLayoutRevision);
    const afterAnimation = window.setTimeout(bumpLayoutRevision, SECTION_LAYOUT_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(afterAnimation);
    };
  }, [openSection]);

  useEffect(() => {
    const prefetchUrls = [
      potteryCollections[0]?.images[0]?.src,
      MACRAME_IMAGES[0],
    ].filter(Boolean) as string[];

    prefetchUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, []);

  const graphicHeaderRef = useRef<HTMLButtonElement>(null);
  const potteryHeaderRef = useRef<HTMLButtonElement>(null);
  const macrameHeaderRef = useRef<HTMLButtonElement>(null);

  const sectionHeaderRefs: Record<WorkSection, React.RefObject<HTMLButtonElement | null>> = {
    graphic: graphicHeaderRef,
    pottery: potteryHeaderRef,
    macrame: macrameHeaderRef,
  };

  const isGraphicDesignOpen = openSection === 'graphic';
  const isPotteryOpen = openSection === 'pottery';
  const isMacrameOpen = openSection === 'macrame';

  const graphicPosition = useHeaderScrollPosition(graphicHeaderRef, layoutRevision);
  const potteryPosition = useHeaderScrollPosition(potteryHeaderRef, layoutRevision);
  const macramePosition = useHeaderScrollPosition(macrameHeaderRef, layoutRevision);

  const sectionPositions: Record<WorkSection, HeaderScrollPosition> = {
    graphic: graphicPosition,
    pottery: potteryPosition,
    macrame: macramePosition,
  };

  const anchorZoneRef = useRef<Record<WorkSection, boolean>>({
    graphic: false,
    pottery: false,
    macrame: false,
  });

  const anchorZones: Record<WorkSection, boolean> = {
    graphic: readAnchorZone(
      graphicHeaderRef,
      'graphic',
      sectionPositions,
      anchorZoneRef.current.graphic
    ),
    pottery: readAnchorZone(
      potteryHeaderRef,
      'pottery',
      sectionPositions,
      anchorZoneRef.current.pottery
    ),
    macrame: readAnchorZone(
      macrameHeaderRef,
      'macrame',
      sectionPositions,
      anchorZoneRef.current.macrame
    ),
  };

  anchorZoneRef.current = anchorZones;

  const topStickySections = resolveTopStickySections(sectionPositions, anchorZones);

  const visibleTopStickySections = topStickySections;

  const [topStickyNavHeight, setTopStickyNavHeight] = useState(0);

  useLayoutEffect(() => {
    const measure = () => setTopStickyNavHeight(getTopStickyNavHeightPx());
    measure();

    const topNav = document.querySelector('.work-sticky-nav-top');
    const observer = topNav ? new ResizeObserver(measure) : null;
    if (topNav && observer) observer.observe(topNav);
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [visibleTopStickySections.length, layoutRevision]);

  const topStickyTitles: Record<WorkSection, string> = {
    graphic: t.work.sections.graphic,
    pottery: t.work.sections.pottery,
    macrame: t.work.sections.macrame,
  };

  const showBottomPottery = potteryPosition === 'below' && !isPotteryOpen && !isMacrameOpen;
  const showBottomMacrame = macramePosition === 'below' && !isMacrameOpen;
  const showBottomNav = showBottomPottery || showBottomMacrame;

  const [bottomNavPadding, setBottomNavPadding] = useState(0);

  useLayoutEffect(() => {
    if (!showBottomNav) {
      setBottomNavPadding(0);
      return;
    }

    const measure = () => setBottomNavPadding(getBottomStickyNavHeightPx());
    measure();

    const bottomNav = document.querySelector('.work-floating-nav');
    const observer = bottomNav ? new ResizeObserver(measure) : null;
    observer?.observe(bottomNav as Element);
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [showBottomNav, showBottomPottery, showBottomMacrame]);

  const scrollRafRef = useRef<number | null>(null);

  const cancelPendingScroll = () => {
    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
  };

  const getSectionScrollTarget = (section: WorkSection): number | undefined => {
    const header = sectionHeaderRefs[section].current;
    if (!header) return undefined;

    const offset = getScrollOffsetPxForSection(section, visibleTopStickySections);
    const currentSectionIndex = openSection ? WORK_SECTION_ORDER.indexOf(openSection) : -1;
    const targetSectionIndex = WORK_SECTION_ORDER.indexOf(section);
    const currentPanel = openSection
      ? sectionHeaderRefs[openSection].current?.closest('section')?.querySelector('.work-section-panel')
      : null;
    const collapsingHeight =
      currentSectionIndex >= 0 && currentSectionIndex < targetSectionIndex
        ? currentPanel?.getBoundingClientRect().height ?? 0
        : 0;

    return Math.max(
      0,
      header.getBoundingClientRect().top + window.scrollY - offset - collapsingHeight
    );
  };

  const scrollToOpenedSection = (section: WorkSection, targetTop?: number) => {
    cancelPendingScroll();
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      scrollToSectionHeader(
        sectionHeaderRefs[section],
        section,
        visibleTopStickySections,
        targetTop
      );
    });
  };

  const openOrScrollToSection = (
    section: WorkSection,
    source: SectionNavSource = 'header'
  ) => {
    const isSectionChange = openSection !== section;
    const fromNav = source === 'top' || source === 'bottom';

    if (!isSectionChange) {
      if (fromNav) scrollToOpenedSection(section);
      return;
    }

    const scrollTarget = fromNav ? getSectionScrollTarget(section) : undefined;
    const shouldScroll =
      fromNav ||
      needsScrollToSectionHeader(section, sectionHeaderRefs, visibleTopStickySections);

    flushSync(() => {
      setOpenSection(section);
    });

    if (shouldScroll) scrollToOpenedSection(section, scrollTarget);
  };

  const toggleSection = (section: WorkSection) => {
    if (openSection === section) {
      cancelPendingScroll();
      setOpenSection(null);
      return;
    }

    openOrScrollToSection(section);
  };


  useEffect(() => {
    return () => {
      cancelPendingScroll();
    };
  }, []);

  const graphicDesignImages = [
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345111/Ilustracio%CC%81n_sin_ti%CC%81tulo_2_sh2jzm.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345565/Ilustracio%CC%81n_sin_ti%CC%81tulo_3_u6zqj7.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345564/Ilustracio%CC%81n_sin_ti%CC%81tulo_18_copy_3_mi1cdd.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345563/Ilustracio%CC%81n_sin_ti%CC%81tulo_17_copy_3_oqt6ea.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345562/Ilustracio%CC%81n_sin_ti%CC%81tulo_16_copy_3_x5bfnc.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345560/Ilustracio%CC%81n_sin_ti%CC%81tulo_15_copy_2_u5dcd4.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345560/Ilustracio%CC%81n_sin_ti%CC%81tulo_12_copy_xtv28e.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345559/Ilustracio%CC%81n_sin_ti%CC%81tulo_1_copy_2_nyi0aj.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345558/ilunnamed-1_copy_2_cq1poq.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345558/Copia_de_unnamed_acidpc.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345557/Casitas_Jpg_copy_3_dvdhri.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345117/unnamed_qrim6m.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345115/Jaguar_patern_cs7kox.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345115/Ilustracio%CC%81n_sin_ti%CC%81tulo_artclz.jpg",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345115/Ilustracio%CC%81n_sin_ti%CC%81tulo_9_ellbub.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345114/Ilustracio%CC%81n_sin_ti%CC%81tulo_6_djd8nn.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345113/Ilustracio%CC%81n_sin_ti%CC%81tulo_5_cxh25h.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345566/Ilustracio%CC%81n_sin_ti%CC%81tulo_4_copy_k2atci.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345083/Ilustracio%CC%81n_sin_ti%CC%81tulo_14_uxzdrz.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345082/Ilustracio%CC%81n_sin_ti%CC%81tulo_13_odgybk.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345081/Ilustracio%CC%81n_sin_ti%CC%81tulo_11_p9tojh.png",
    "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1774345081/Ilustracio%CC%81n_sin_ti%CC%81tulo_10_cgoyzs.png",
  ];

  const sectionHeaderButtonClass =
    'work-section-header flex items-center justify-between mb-8 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent text-left';

  return (
    <div
      className="min-h-screen bg-brand-dark-teal w-full"
      style={{
        paddingBottom: bottomNavPadding
          ? `calc(${bottomNavPadding}px + env(safe-area-inset-bottom, 0px))`
          : undefined,
        ['--work-sticky-nav-stack-height-px' as string]: `${topStickyNavHeight}px`,
        ['--work-bottom-nav-height-px' as string]: `${bottomNavPadding}px`,
      }}
    >
      <section className="page-shell bg-brand-dark-teal w-full">
        <h1 className="section-title-pink font-temeraire-display text-center uppercase">
          {t.work.title}
        </h1>
      </section>

      <section className="skills-section skills-section--compact page-shell">
        <div className="skills-row work-skills-row">
          {t.work.skills.map((tag, index, arr) => (
            <React.Fragment key={tag}>
              <span
                className="skills-text type-skills lowercase text-[#FBEAD5]"
              >
                {tag}
              </span>
              {index < arr.length - 1 && (
                <span className="work-skills-separator text-[#FBEAD5]">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div
        className="relative"
        style={{
          ['--work-sticky-nav-stack-count' as string]: String(visibleTopStickySections.length),
        }}
      >
        {visibleTopStickySections.length > 0 && (
          <div className="work-sticky-nav-top" aria-label="Section navigation top">
            {visibleTopStickySections.map((section) => (
              <div key={section} className="work-floating-nav-item page-x">
                <WorkStickyBar
                  title={topStickyTitles[section]}
                  isOpen={openSection === section}
                  onNavigate={() => openOrScrollToSection(section, 'top')}
                />
              </div>
            ))}
          </div>
        )}

        <section className="page-shell bg-brand-dark-teal w-full">
          <button
            ref={graphicHeaderRef}
            type="button"
            onClick={() => toggleSection('graphic')}
            className={sectionHeaderButtonClass}
          >
            <h2 className="section-title font-temeraire-display">
              {t.work.sections.graphic}
            </h2>
            <motion.div
              animate={{ rotate: isGraphicDesignOpen ? 180 : 0 }}
              transition={WORK_ARROW_TRANSITION}
              className="transition-all opacity-100 hover:opacity-80"
              style={{ color: '#FF8A9D' }}
            >
              <FaArrowDown size={48} />
            </motion.div>
          </button>
          <WorkSectionPanel isOpen={isGraphicDesignOpen}>
            <div className="flex flex-col">
              <div
                className="box-border block w-full leading-none"
                style={{ marginBottom: GRAPHIC_GALLERY_GAP_PX }}
              >
                <Image
                  src={getGraphicMasonryUrl(graphicDesignImages[0], 2560)}
                  alt="Graphic design piece 1 — Ilustración sin título 2"
                  width={2400}
                  height={1200}
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
                  const imageSrc = graphicDesignImages[originalIndex];
                  const isAboveFold = index < 4;
                  return (
                    <div
                      key={originalIndex}
                      className="box-border block w-full leading-none"
                      style={{ marginBottom: GRAPHIC_GALLERY_GAP_PX }}
                    >
                      <Image
                        src={getGraphicMasonryUrl(imageSrc)}
                        alt={`Graphic design piece ${originalIndex + 1}`}
                        width={1200}
                        height={1200}
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
          </WorkSectionPanel>
        </section>

        {showBottomNav && (
          <div className="work-floating-nav" aria-label="Section navigation bottom">
            {showBottomPottery && (
              <div className="work-floating-nav-item page-x">
                <WorkStickyBar
                  title={t.work.sections.pottery}
                  isOpen={isPotteryOpen}
                  onNavigate={() => openOrScrollToSection('pottery', 'bottom')}
                />
              </div>
            )}
            {showBottomMacrame && (
              <div className="work-floating-nav-item page-x">
                <WorkStickyBar
                  title={t.work.sections.macrame}
                  isOpen={isMacrameOpen}
                  onNavigate={() => openOrScrollToSection('macrame', 'bottom')}
                />
              </div>
            )}
          </div>
        )}

        <section className="page-shell relative z-0 bg-brand-dark-teal w-full">
          <button
            ref={potteryHeaderRef}
            type="button"
            onClick={() => toggleSection('pottery')}
            className={sectionHeaderButtonClass}
          >
            <h2 className="section-title font-temeraire-display">{t.work.sections.pottery}</h2>
            <motion.div
              animate={{ rotate: isPotteryOpen ? 180 : 0 }}
              transition={WORK_ARROW_TRANSITION}
              style={{ color: '#FF8A9D' }}
            >
              <FaArrowDown size={48} />
            </motion.div>
          </button>
          <WorkSectionPanel isOpen={isPotteryOpen}>
            <PotteryCollections />
          </WorkSectionPanel>
        </section>

        <section className="page-shell bg-brand-dark-teal w-full">
          <button
            ref={macrameHeaderRef}
            type="button"
            onClick={() => toggleSection('macrame')}
            className={sectionHeaderButtonClass}
          >
            <h2 className="section-title font-temeraire-display">{t.work.sections.macrame}</h2>
            <motion.div
              animate={{ rotate: isMacrameOpen ? 180 : 0 }}
              transition={WORK_ARROW_TRANSITION}
              style={{ color: '#FF8A9D' }}
            >
              <FaArrowDown size={48} />
            </motion.div>
          </button>
          <WorkSectionPanel isOpen={isMacrameOpen}>
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
                    priority={index === 0}
                    sizes="(max-width: 767px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </WorkSectionPanel>
        </section>
      </div>
    </div>
  );
}
