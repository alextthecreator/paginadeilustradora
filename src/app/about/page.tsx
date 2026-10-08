'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

const SLIDE_MS = 4500;

function AboutPhotoSlideshow({
  altPrimary,
  altSecondary,
}: {
  altPrimary: string;
  altSecondary: string;
}) {
  const [index, setIndex] = useState(0);
  const alts = { photoAlt: altPrimary, photoAltSecondary: altSecondary };

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % ABOUT_SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="about-media-card about-media-slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label={altPrimary}
    >
      {/* Both photos stay mounted and layered — crossfade by opacity */}
      {ABOUT_SLIDES.map((slide, i) => (
        <motion.div
          key={slide.publicId}
          className={`about-media-slide${i === index ? " is-active" : ""}`}
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
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
        </motion.div>
      ))}

      <div className="about-media-dots">
        {ABOUT_SLIDES.map((item, i) => (
          <button
            key={item.publicId}
            type="button"
            className={`about-media-dot${i === index ? " is-active" : ""}`}
            aria-label={`${i + 1} / ${ABOUT_SLIDES.length}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
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
            className="about-copy about-copy-right"
          >
            <h1 className="type-display font-temeraire-display uppercase text-[#FF8A9D] mb-5 pt-2 md:pt-4">
              {t.about.aboutMeTitle}
            </h1>
            <p className="about-lead type-lead readable-text font-mencken-bold text-[#FBEAD5] mb-5">
              {t.about.aboutMeIntro}
            </p>
            <p className="about-body type-body readable-text font-mencken-regular text-[#FBEAD5] mt-8 text-justify md:m-12">
              <MultilineText text={t.about.aboutMeBody} />
            </p>
          </motion.div>
        </section>

        <section className="about-row about-row-bottom">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="about-copy about-copy-left order-2 md:order-1"
          >
            <h2 className="type-display font-temeraire-display uppercase text-[#FF8A9D] mb-5">
              {t.about.toskaTitle}
            </h2>
            <p className="about-lead type-lead readable-text font-mencken-bold text-[#FBEAD5] mb-5">
              {t.about.toskaIntro}
            </p>
            <p className="about-body type-body readable-text font-mencken-regular text-[#FBEAD5] mt-8 mb-12 text-justify">
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
