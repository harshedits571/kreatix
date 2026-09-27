"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero({ settings }) {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.__lenis) {
      const el = document.getElementById(id);
      if (el) {
        window.__lenis.scrollTo(el, { offset: -85, duration: 1.35 });
        return;
      }
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="hero-exact-section" id="hero">
      <div className="hero-exact-container">
        
        {/* 1. Pill Badge */}
        <div className="hero-exact-badge">
          <span className="hero-exact-dot"></span>
          <span className="hero-exact-badge-text">
            {settings?.heroBadge || "Thumbnail Strategy + Design"}
          </span>
        </div>

        {/* 2. Main Title */}
        <h1 className="hero-exact-title">
          {settings?.heroHeadline ? (
            settings.heroHeadline
          ) : (
            <>
              Thumbnail Strategy <br className="hidden md:block" />That Gets Clicks.
            </>
          )}
        </h1>
        
        {/* 3. Subtitle */}
        <p className="hero-exact-desc">
          {settings?.heroSubhead || "Strategic thumbnails designed to earn attention, communicate instantly, and turn impressions into views."}
        </p>

        {/* 4. Action Buttons */}
        <div className="hero-exact-actions">
          <motion.a 
            href="#booking" 
            onClick={(e) => handleScrollTo(e, 'booking')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hero-exact-btn-primary"
          >
            <span>Get Started</span>
            <span aria-hidden="true">&rarr;</span>
          </motion.a>
          
          <Link 
            href="/work" 
            className="hero-exact-btn-secondary"
          >
            <motion.span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Explore Work</span>
              <span aria-hidden="true">&rarr;</span>
            </motion.span>
          </Link>
        </div>

        {/* 5. Trust Subtitle */}
        <p className="hero-exact-trust">
          Trusted by creators generating millions of views
        </p>

      </div>
    </section>
  );
}
