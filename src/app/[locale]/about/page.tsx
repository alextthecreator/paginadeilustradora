'use client';

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import CloudinaryImage from "@/components/CloudinaryImage";
import { useLanguage } from "@/i18n/LanguageContext";

function MultilineText({ text }: { text: string }) {
  const paragraphs = text.split('\n\n');

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <span key={index}>
          {index > 0 && (
            <>
              <br />
              <br />
            </>
          )}
          {paragraph}
        </span>
      ))}
    </>
  );
}

const ABOUT_SLIDES = [
  {
    publicId: "about_me2",
    width: 857,
    height: 1285,
    altKey: "photoAlt" as const,
  },
  {
    publicId: "about_me1",
    width: 875,
    height: 1313,
    altKey: "photoAltSecondary" as const,
  },
];

const SLIDE_MS = 5000;

function AboutPhotoSlideshow({
  altPrimary,
  altSecondary,
}: {
  altPrimary: string;
  altSecondary: string;
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const alts = { photoAlt: altPrimary, photoAltSecondary: altSecondary };

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (reducedMotionRef.current) return;
    timerRef.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % ABOUT_SLIDES.length);
    }, SLIDE_MS);
  }, [clearTimer]);

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const goTo = (next: number) => {
    setIndex(next);
    startTimer();
  };

  return (
    <div
      className="about-media-card about-media-slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label={altPrimary}
    >
      {ABOUT_SLIDES.map((slide, i) => (
        <div
          key={slide.publicId}
          className={`about-media-slide${i === index ? " is-active" : ""}`}
          aria-hidden={i !== index}
        >
          <CloudinaryImage
            publicId={slide.publicId}
            alt={alts[slide.altKey]}
            width={slide.width}
            height={slide.height}
            className="about-media-img"
            priority
            transformations={{ crop: "fill", fetch_format: "jpg", pg: 1 }}
          />
        </div>
      ))}

      <div className="about-media-dots">
        {ABOUT_SLIDES.map((item, i) => (
          <button
            key={item.publicId}
            type="button"
            className={`about-media-dot${i === index ? " is-active" : ""}`}
            aria-label={`${i + 1} / ${ABOUT_SLIDES.length}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* eslint-disable react/no-unescaped-entities */

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-brand-dark-teal w-full text-brand-light-text min-h-[70vh]">
      <div className="about-page-content about-layout page-y">
        <section className="about-row about-row-top">
          <motion.div
            className="about-media-wrap"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AboutPhotoSlideshow
              altPrimary={t.about.photoAlt}
              altSecondary={t.about.photoAltSecondary}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="about-copy about-copy-left"
          >
            <h1 className="type-display font-temeraire-display uppercase text-[#FF8A9D] mb-5 pt-2 md:pt-4">
              {t.about.aboutMeTitle}
            </h1>
            <p className="about-lead type-lead readable-text font-mencken-bold text-[#FBEAD5] mb-5">
              {t.about.aboutMeIntro}
            </p>
            <p className="about-body type-body readable-text font-mencken-regular text-[#FBEAD5] mt-8">
              <MultilineText text={t.about.aboutMeBody} />
            </p>
          </motion.div>
        </section>

        <section className="about-row about-row-bottom">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="about-copy about-copy-right order-2 md:order-1"
          >
            <h2 className="type-display font-temeraire-display uppercase text-[#FF8A9D] mb-5">
              {t.about.toskaTitle}
            </h2>
            <p className="about-lead type-lead readable-text font-mencken-bold text-[#FBEAD5] mb-5">
              {t.about.toskaIntro}
            </p>
            <p className="about-body type-body readable-text font-mencken-regular text-[#FBEAD5] mt-8 mb-12">
              <MultilineText text={t.about.toskaBody} />
            </p>
          </motion.div>

          <motion.div
            className="about-media-card about-media-card-secondary order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CloudinaryImage
              publicId="about_me3"
              alt={t.about.toskaPhotoAlt}
              width={875}
              height={1313}
              className="about-media-img"
              transformations={{ crop: "fill", fetch_format: "jpg", pg: 1 }}
            />
          </motion.div>
        </section>
      </div>
    </div>
  );
}
