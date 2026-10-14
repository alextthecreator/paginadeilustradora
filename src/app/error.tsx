'use client';

import { useEffect } from 'react';
import Link from '@/components/ShopSafeLink';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f2e1f] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-8"
          style={{ color: '#FF8A9D' }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Oops!
        </motion.h1>
        
        <motion.h2
          className="text-2xl md:text-3xl font-serif mb-6"
          style={{ color: '#FBEAD5' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Something went wrong
        </motion.h2>
        
        <motion.p
          className="text-lg mb-8"
          style={{ color: '#FBEAD5' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          We&apos;re sorry, but something unexpected happened. Please try again or go back to the homepage.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={reset}
            className="bg-[#FF8A9D] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#E91E63] transition-colors duration-300"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-block bg-transparent border-2 border-[#FF8A9D] text-[#FF8A9D] px-8 py-4 rounded-full font-medium text-lg hover:bg-[#FF8A9D] hover:text-white transition-colors duration-300"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
