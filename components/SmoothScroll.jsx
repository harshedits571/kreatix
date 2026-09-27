"use client";

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function SmoothScroll({ children }) {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.2,
    restDelta: 0.0005
  });

  useEffect(() => {
    setMounted(true);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.25,
      touchMultiplier: 2.0,
      touchInertiaMultiplier: 1.6,
      infinite: false,
    });

    if (typeof window !== 'undefined') {
      window.__lenis = lenis;
    }

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Global smooth anchor click handler with inertia deceleration
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, {
              offset: -85,
              duration: 1.1,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      if (typeof window !== 'undefined') {
        window.__lenis = null;
      }
    };
  }, []);

  return (
    <>
      {/* Top Scroll Progress Indicator */}
      {mounted && (
        <motion.div
          style={{
            scaleX: smoothProgress,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #50B1FF 0%, #38BDF8 50%, #60A5FA 100%)',
            transformOrigin: '0%',
            zIndex: 99999,
            boxShadow: '0 0 12px rgba(80, 177, 255, 0.75)',
            pointerEvents: 'none'
          }}
        />
      )}
      {children}
    </>
  );
}

