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
    <div className="bg-brand-secondary-pink w-full text-brand-light-text py-12 md:py-16 min-h-[70vh]">
      <div className="about-page-content">
        {/* Row 1: About Me */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <motion.div
            className="w-full max-w-md mx-auto aspect-square relative overflow-hidden rounded-lg shadow-lg"
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
            className="text-right w-full max-w-xl mx-auto md:mx-0 md:ml-auto"
          >
            <h1
              className="font-temeraire-display uppercase font-bold text-[#FF8A9D]"
              style={{ fontSize: '70px', marginBottom: '20px', paddingTop: '50px' }}
            >
              {t.about.aboutMeTitle}
            </h1>
            <p
              className="font-mencken-bold text-[#FBEAD5] ml-auto"
              style={{ fontSize: '24px', marginBottom: '20px', maxWidth: '500px', justifySelf: 'right' }}
            >
              {t.about.aboutMeIntro}
            </p>
            <p
              className="font-mencken-regular text-[#FBEAD5]"
              style={{ fontSize: '16px', marginBottom: '20px', marginTop: '50px', textAlign: 'justify', lineHeight: '1.3' }}
            >
              <MultilineText text={t.about.aboutMeBody} />
            </p>
          </motion.div>
        </div>

        {/* Row 2: About Toska Art Project */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center mt-10 md:mt-16" style={{ paddingTop: '20px' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-xl mx-auto md:mx-0 order-2 md:order-1"
            style={{ paddingTop: '20px' }}
          >
            <h2
              className="font-temeraire-display uppercase font-bold text-[#FF8A9D]"
              style={{ fontSize: '70px', marginBottom: '20px' }}
            >
              {t.about.toskaTitle}
            </h2>
            <p
              className="font-mencken-bold text-[#FBEAD5]"
              style={{ fontSize: '24px', marginBottom: '20px', maxWidth: '500px' }}
            >
              {t.about.toskaIntro}
            </p>
            <p
              className="font-mencken-regular text-[#FBEAD5]"
              style={{ fontSize: '16px', marginBottom: '50px', marginTop: '50px', textAlign: 'justify', lineHeight: '1.3' }}
            >
              <MultilineText text={t.about.toskaBody} />
            </p>
          </motion.div>

          <motion.div
            className="w-full max-w-md mx-auto aspect-square relative overflow-hidden rounded-lg shadow-lg order-1 md:order-2"
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
        </div>
      </div>
    </div>
  );
}
