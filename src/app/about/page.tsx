'use client';

import { motion } from "framer-motion";
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

/* eslint-disable react/no-unescaped-entities */

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-brand-dark-teal w-full text-brand-light-text min-h-[70vh]">
      <div className="about-page-content about-layout page-y">
        <section className="about-row about-row-top">
          <motion.div
            className="about-media-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CloudinaryImage
              publicId="toska-cr/about/about_me.jpg"
              alt={t.about.photoAlt}
              width={600}
              height={600}
              className="object-cover"
              priority
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
            <p className="about-body type-body readable-text font-mencken-regular text-[#FBEAD5] mt-8 m-12 text-justify">
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
              publicId="toska-cr/work/macrame/Toska-128.jpg"
              alt={t.about.toskaPhotoAlt}
              width={600}
              height={600}
              className="object-cover justify-self-end"
            />
          </motion.div>
        </section>
      </div>
    </div>
  );
}
