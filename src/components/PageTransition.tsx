'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Enter-only fade. AnimatePresence exit animations were racing with Ecwid's
 * DOM mutations and causing removeChild crashes when switching routes.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="min-h-screen w-full min-w-0"
    >
      {children}
    </motion.div>
  );
}
