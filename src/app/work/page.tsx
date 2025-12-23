'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";

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
              <div 
                className="grid gap-2"
                style={{
                  gridTemplateColumns: 'repeat(24, 1fr)',
                  gridAutoRows: 'minmax(150px, auto)',
                  gridAutoFlow: 'row dense'
                }}
              >
          {[
            // Rząd 1: baner na całą długość, niska wysokość
            { colSpan: 24, rowSpan: 2 },
            
            // Rząd 2: 3 obrazki w ratio 3:2 (wysokie prostokąty)
            { colSpan: 8, rowSpan: 5 },
            { colSpan: 8, rowSpan: 5 },
            { colSpan: 8, rowSpan: 5 },
            
            // Rząd 3: 2 "leżące" prostokąty
            { colSpan: 12, rowSpan: 4 },
            { colSpan: 12, rowSpan: 4 },
            
            // Rząd 4: szeroki prostokąt po lewej, wąski wysoki po prawej
            { colSpan: 18, rowSpan: 5 },
            { colSpan: 6, rowSpan: 5 },
            
            // Rząd 5: 3 × kwadrat
            { colSpan: 8, rowSpan: 4 },
            { colSpan: 8, rowSpan: 4 },
            { colSpan: 8, rowSpan: 4 },
            
            // Rząd 6: kwadrat, prostokąt wysoki, kwadrat
            // 4.5 kolumny w 12-kolumnowym = 9 kolumn w 24-kolumnowym
            // 3.5 kolumny w 12-kolumnowym = 7 kolumn w 24-kolumnowym
            { colSpan: 9, rowSpan: 4 },
            { colSpan: 6, rowSpan: 4 },
            { colSpan: 9, rowSpan: 4 },
            
            // Rząd 7: kwadrat, szeroki prostokąt
            { colSpan: 8, rowSpan: 5 },
            { colSpan: 16, rowSpan: 5 },
            
            // Rząd 8: 4 wysokie wąskie prostokąty
            { colSpan: 6, rowSpan: 6 },
            { colSpan: 6, rowSpan: 6 },
            { colSpan: 6, rowSpan: 6 },
            { colSpan: 6, rowSpan: 6 },
            
            // Rząd 9: dwa niskie szerokie prostokąty
            { colSpan: 12, rowSpan: 2 },
            { colSpan: 12, rowSpan: 2 },
          ].map((size, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-gray-300 rounded-lg overflow-hidden"
              style={{
                gridColumn: `span ${size.colSpan}`,
                gridRow: `span ${size.rowSpan}`
              }}
            >
              <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">Placeholder {index + 1}</span>
              </div>
            </motion.div>
          ))}
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