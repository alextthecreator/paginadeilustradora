'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

/** Masonry / referencja portfolio: naturalne proporcje, bez przycinania — tylko limit szerokości i jakość. */
function getGraphicMasonryUrl(src: string, maxWidthPx = 1800): string {
  if (!src.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return src;
  }

  const transforms = `f_auto,q_auto:best,c_limit,w_${maxWidthPx},dpr_auto`;
  return src.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transforms}/`);
}

const GRAPHIC_MASONRY_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/** Odstęp między kolumnami i wierszami + „paspartu” wokół obrazu */
const GRAPHIC_GALLERY_GAP_PX = 10;

/**
 * Po hero: najpierw cała seria „Ilustración sin título” (spójny blok), na końcu inne prace.
 * Kolejność można dowolnie zmieniać — wpływa tylko na układ w kolumnach.
 * Indeksy 5 i 4 zamienione: Ilustración sin título 15 wyżej w przepływie (lepiej wypełnia układ).
 * Casitas (10) między 8 a 9 — ten sam rozmiar kafel co reszta (bez column-span), mniej „dziur” w kolumnach.
 */
const GRAPHIC_ORDER_AFTER_HERO: readonly number[] = [
  1, 2, 3, 5, 4, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 8, 10, 9, 11, 12,
];

export default function WorkPage() {
  const [isGraphicDesignOpen, setIsGraphicDesignOpen] = useState(true);
  const [isPotteryOpen, setIsPotteryOpen] = useState(true);
  const [isMacrameOpen, setIsMacrameOpen] = useState(true);

  // Czy użytkownik jest jeszcze powyżej naturalnej pozycji danej sekcji?
  const [showFloatingPottery, setShowFloatingPottery] = useState(true);
  const [showFloatingMacrame, setShowFloatingMacrame] = useState(true);

  const potteryRef = useRef<HTMLElement | null>(null);
  const macrameRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (potteryRef.current) {
        const rect = potteryRef.current.getBoundingClientRect();
        const threshold = window.innerHeight - 150; // ok. 150px nad dolną krawędzią
        // Pokazuj przyklejony nagłówek tylko, gdy górna krawędź sekcji
        // znajduje się poniżej progu (czyli sekcja jest jeszcze „niżej” na stronie)
        setShowFloatingPottery(rect.top > threshold);
      }

      if (macrameRef.current) {
        const rect = macrameRef.current.getBoundingClientRect();
        const threshold = window.innerHeight - 150;
        setShowFloatingMacrame(rect.top > threshold);
      }
    };

    // Nie wywołujemy handleScroll od razu, żeby przyklejone nagłówki
    // były widoczne zaraz po załadowaniu strony. Logika chowania
    // uruchamia się dopiero po pierwszym scrollu / resize.
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
  return (
    <div className="min-h-screen bg-brand-dark-teal w-full">
      {/* Main Work Title */}
      <section className="bg-brand-dark-teal py-20 w-full" style={{ paddingTop: '60px', paddingBottom: '40px', marginBottom: 0 }}>
        <div className="w-full" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
          <h1 
            className="font-temeraire-display uppercase font-bold"
            style={{ fontSize: '60px', color: '#FF8A9D', textAlign: 'center' }}
          >
            My Work
          </h1>
        </div>
      </section>

      {/* Pink Skills Section */}
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
                  <span style={{ color: '#FBEAD5', fontSize: '20px' }}>•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Work Sections Container */}
      <div className="relative">
      {/* Graphic Design & Illustration Section */}
      <section className="bg-brand-dark-teal w-full" style={{ paddingTop: '80px', paddingBottom: '0px', paddingLeft: '60px', paddingRight: '60px' }}>
        <button
          onClick={() => setIsGraphicDesignOpen(!isGraphicDesignOpen)}
          className="w-full flex items-center justify-between mb-8 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h2 
            className="font-temeraire-display font-bold"
            style={{ fontSize: '60px', color: '#FBEAD5', textAlign: 'left' }}
          >
            Graphic Design & Illustration
          </h2>
          <motion.div
            animate={{ rotate: isGraphicDesignOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="transition-all opacity-100 hover:opacity-80"
            style={{ color: '#FF8A9D' }}
          >
            <FaArrowDown size={48} />
          </motion.div>
        </button>
        <AnimatePresence>
          {isGraphicDesignOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="flex flex-col">
                {/* Pierwsza praca: pełna szerokość */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0 }}
                  className="box-border block w-full leading-none"
                  style={{ marginBottom: GRAPHIC_GALLERY_GAP_PX }}
                >
                  <div
                    className="box-border overflow-hidden rounded-lg bg-brand-cream shadow-sm ring-1 ring-black/10"
                    style={{ padding: GRAPHIC_GALLERY_GAP_PX }}
                  >
                    <Image
                      src={getGraphicMasonryUrl(graphicDesignImages[0], 2560)}
                      alt="Graphic design piece 1 — Ilustración sin título 2"
                      width={2400}
                      height={1200}
                      className="block h-auto w-full max-w-full align-top"
                      sizes="100vw"
                      quality={95}
                      loading="eager"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Masonry (kolumny): naturalne wypełnienie bez „dziur” jak w CSS Grid; kolejność = GRAPHIC_ORDER_AFTER_HERO */}
                <div
                  className="columns-1 sm:columns-2 lg:columns-3 [&>*]:break-inside-avoid"
                  style={{ columnGap: GRAPHIC_GALLERY_GAP_PX }}
                >
                  {GRAPHIC_ORDER_AFTER_HERO.map((originalIndex, orderPos) => {
                    const imageSrc = graphicDesignImages[originalIndex];
                    return (
                      <motion.div
                        key={originalIndex}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: (orderPos + 1) * 0.05
                        }}
                        className="box-border block w-full leading-none"
                        style={{ marginBottom: GRAPHIC_GALLERY_GAP_PX }}
                      >
                        <div
                          className="box-border overflow-hidden rounded-lg bg-brand-cream shadow-sm ring-1 ring-black/10"
                          style={{ padding: GRAPHIC_GALLERY_GAP_PX }}
                        >
                          <Image
                            src={getGraphicMasonryUrl(imageSrc)}
                            alt={`Graphic design piece ${originalIndex + 1}`}
                            width={1200}
                            height={1200}
                            className="block h-auto w-full max-w-full align-top"
                            sizes={GRAPHIC_MASONRY_SIZES}
                            quality={95}
                            loading={orderPos < 3 ? "eager" : "lazy"}
                            priority={orderPos < 3}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Pottery Section - Fixed (tylko zanim dotrzemy do sekcji) */}
      {showFloatingPottery && (
        <div
          style={{
            position: 'fixed',
            // Jeśli Macramé też jest przyklejone, ustawiamy Pottery tuż nad nim
            bottom: showFloatingMacrame ? '70px' : 0,
            left: 0,
            right: 0,
            zIndex: 20,
            backgroundColor: '#1a4d3a',
            paddingLeft: '60px',
            paddingRight: '60px',
            paddingTop: '0px',
            paddingBottom: '0px'
          }}
        >
          <button
            onClick={() => setIsPotteryOpen(!isPotteryOpen)}
            className="w-full flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
            style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}
          >
            <h2 
              className="font-temeraire-display font-bold"
              style={{ fontSize: '60px', color: '#FBEAD5', textAlign: 'left', margin: 0, padding: 0 }}
            >
              Pottery
            </h2>
            <motion.div
              animate={{ rotate: isPotteryOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="transition-all opacity-100 hover:opacity-80"
              style={{ color: '#FF8A9D' }}
            >
              <FaArrowDown size={48} />
            </motion.div>
          </button>
        </div>
      )}
      {/* Pottery Section - Normal flow */}
      <section 
        ref={potteryRef}
        className="bg-brand-dark-teal w-full" 
        style={{ 
          paddingTop: '80px', 
          paddingBottom: '0px', 
          paddingLeft: '60px', 
          paddingRight: '60px'
        }}
      >
          <button
            onClick={() => setIsPotteryOpen(!isPotteryOpen)}
            className="w-full flex items-center justify-between mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          >
          <h2 
            className="font-temeraire-display font-bold"
            style={{ fontSize: '60px', color: '#FBEAD5', textAlign: 'left' }}
          >
            Pottery
          </h2>
          <motion.div
            animate={{ rotate: isPotteryOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="transition-all opacity-100 hover:opacity-80"
            style={{ color: '#FF8A9D' }}
          >
            <FaArrowDown size={48} />
          </motion.div>
        </button>
        <AnimatePresence>
          {isPotteryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
          {[
            "/images/work/pottery/IMG_2343.jpg",
            "/images/work/pottery/IMG_2353.jpg", 
            "/images/work/pottery/IMG_2477.jpg",
            "/images/work/pottery/IMG_2491.jpg",
            "/images/work/pottery/IMG_2497.jpg",
            "/images/work/pottery/IMG_2512.jpg"
          ].map((imagePath, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={imagePath}
                alt={`Pottery piece ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={index < 3}
              />
            </motion.div>
          ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Macrame Section - Fixed (tylko zanim dotrzemy do sekcji) */}
      {showFloatingMacrame && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            backgroundColor: '#1a4d3a',
            paddingLeft: '60px',
            paddingRight: '60px',
            paddingTop: '0px',
            paddingBottom: '0px'
          }}
        >
          <button
            onClick={() => setIsMacrameOpen(!isMacrameOpen)}
            className="w-full flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
            style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}
          >
            <h2 
              className="font-temeraire-display font-bold"
              style={{ fontSize: '60px', color: '#FBEAD5', textAlign: 'left', margin: 0, padding: 0 }}
            >
              Macramé
            </h2>
            <motion.div
              animate={{ rotate: isMacrameOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="transition-all opacity-100 hover:opacity-80"
              style={{ color: '#FF8A9D' }}
            >
              <FaArrowDown size={48} />
            </motion.div>
          </button>
        </div>
      )}
      {/* Macrame Section - Normal flow */}
      <section 
        ref={macrameRef}
        className="bg-brand-dark-teal w-full" 
        style={{ 
          paddingTop: '80px', 
          paddingBottom: '80px', 
          paddingLeft: '60px', 
          paddingRight: '60px'
        }}
      >
          <button
            onClick={() => setIsMacrameOpen(!isMacrameOpen)}
            className="w-full flex items-center justify-between mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          >
          <h2 
            className="font-temeraire-display font-bold"
            style={{ fontSize: '60px', color: '#FBEAD5', textAlign: 'left' }}
          >
            Macramé
          </h2>
          <motion.div
            animate={{ rotate: isMacrameOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="transition-all opacity-100 hover:opacity-80"
            style={{ color: '#FF8A9D' }}
          >
            <FaArrowDown size={48} />
          </motion.div>
        </button>
        <AnimatePresence>
          {isMacrameOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
          {[
            "/images/work/macrame/Toska-128 copy.jpg",
            "/images/work/macrame/Toska-130 copy.jpg",
            "/images/work/macrame/Toska-146 copy.jpg",
            "/images/work/macrame/Toska-157 copy.jpg",
            "/images/work/macrame/Toska-167 copy.jpg",
            "/images/work/macrame/Toska-170 copy.jpg"
          ].map((imagePath, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={imagePath}
                alt={`Macrame piece ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={index < 3}
              />
            </motion.div>
          ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      </div>
    </div>
  );
}