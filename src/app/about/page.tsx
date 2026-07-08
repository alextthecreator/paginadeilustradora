'use client';

import { motion } from "framer-motion";
import CloudinaryImage from "@/components/CloudinaryImage";

/* eslint-disable react/no-unescaped-entities */

export default function AboutPage() {
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
              alt="Gloriana - Graphic Designer and Illustrator"
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
              About Me
            </h1>
            <p
              className="font-mencken-bold text-[#FBEAD5] ml-auto"
              style={{ fontSize: '24px', marginBottom: '20px', maxWidth: '500px' }}
            >
              Hi! My name is Gloriana, a Costa Rican living in Poland, a graphic designer and illustrator by profession, and someone who is passionate about creating art in many different forms.
            </p>
            <p
              className="font-mencken-regular text-[#FBEAD5]"
              style={{ fontSize: '16px', marginBottom: '20px', marginTop: '50px', textAlign: 'justify', lineHeight: '1.3' }}
            >
              I graduated with a Bachelor&apos;s degree in Advertising Design from Veritas University of Art and Design in Costa Rica in 2012. After completing my studies, I spent four years working at advertising agencies. During that time, I had the opportunity to meet incredible people, work with amazing brands and clients, and gain invaluable professional experience. Those were truly formative years, but I eventually realized that agency life wasn&apos;t the right fit for me.
              <br /><br />
              In 2017, I decided to take a sabbatical year and move to Poland to do something completely different with my life. That was nine years ago... What started as a temporary adventure eventually became my new home. During these years, the idea of Toska was born. I found love and also became the proud dog mom of Augusto (who has since crossed the rainbow bridge) and Oliver. They are my greatest source of support and my most loyal companions.
            </p>
          </motion.div>
        </div>

        {/* Row 2: About Toska Art Project */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center mt-10 md:mt-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-xl mx-auto md:mx-0 order-2 md:order-1"
          >
            <h2
              className="font-temeraire-display uppercase font-bold text-[#FF8A9D]"
              style={{ fontSize: '70px', marginBottom: '20px' }}
            >
              About Toska Art Project
            </h2>
            <p
              className="font-mencken-bold text-[#FBEAD5]"
              style={{ fontSize: '24px', marginBottom: '20px', maxWidth: '500px' }}
            >
              Toska was born in Poland in 2017, just a few months after I moved here. It began as the distant vision of a dream that, years later, has finally taken shape and become a reality.
            </p>
            <p
              className="font-mencken-regular text-[#FBEAD5]"
              style={{ fontSize: '16px', marginBottom: '20px', marginTop: '50px', textAlign: 'justify', lineHeight: '1.3' }}
            >
              My biggest dreams have always been to live in another country and to have my own art and design studio. Although it started very modestly—and was even put on hold for a while—the idea of Toska never left my mind. It has always been a voice in my head, inspiring and motivating me to keep going.
              <br /><br />
              The word toska refers to a deep feeling of nostalgia and longing for the place where you were born. It felt like the perfect name for a project that continues to grow and evolve wherever I am in the world, while remaining deeply rooted in Costa Rica, the home where I grew up.
              <br /><br />
              So far, Toska Art Project has found its expression through illustration and handcrafted techniques such as macramé and ceramics. I don&apos;t rule out exploring other artistic disciplines in the future. Above all, I love creating new things and feel incredibly grateful for the opportunity to make them with my own hands.
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
              alt="Toska Art Project - handcrafted macramé"
              width={600}
              height={600}
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
