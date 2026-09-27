"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll to top cleanly on route change
    if (typeof window !== 'undefined') {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        width: '100%',
        minHeight: '100vh',
      }}
    >
      {children}
    </motion.div>
  );
}
