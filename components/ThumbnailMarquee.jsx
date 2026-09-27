'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ThumbnailMarquee({ row1 = [], row2 = [], row3 = [], onOpenModal }) {
  // Ensure we have robust items for all 3 rows
  const safeRow1 = row1 && row1.length > 0 ? row1 : [];
  const safeRow2 = row2 && row2.length > 0 ? row2 : safeRow1;
  const safeRow3 = row3 && row3.length > 0 ? row3 : safeRow1;

  const dupRow1 = [...safeRow1, ...safeRow1, ...safeRow1];
  const dupRow2 = [...safeRow2, ...safeRow2, ...safeRow2];
  const dupRow3 = [...safeRow3, ...safeRow3, ...safeRow3];

  const handleCardClick = (item) => {
    if (onOpenModal) {
      onOpenModal({
        title: item.title,
        image: item.img,
        creator: "Featured Viral Concept",
        handle: "@KreatixDesign",
        views: "10M+ Views",
        category: "High CTR Masterpiece",
        description: "Custom-crafted visual composition engineered with high emotional contrast and dynamic lighting for peak YouTube suggested placement."
      });
    }
  };

  return (
    <section className="marquee-showcase-section" id="stream">
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-badge">Live Showcase Stream</span>
        <h2 className="section-title">Designed for <span className="highlight">Peak Click-Through</span></h2>
        <p className="section-desc">Real viral thumbnails produced for top creators across Documentary, Tech, Entertainment & Finance.</p>
      </motion.div>

      {/* Relative wrapper with Left & Right Gradient Fade Overlays */}
      <div className="marquee-wrapper-fade">
        <div className="marquee-fade-left"></div>
        <div className="marquee-fade-right"></div>

        <div className="marquee-container">
          {/* Row 1: Left to Right */}
          <div className="thumbnail-row row-right-to-left" id="marquee-row-1">
            {dupRow1.map((item, idx) => (
              <motion.div 
                className="marquee-thumbnail-card" 
                key={`r1-${item.id}-${idx}`}
                onClick={() => handleCardClick(item)}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="marquee-overlay">
                  <div className="marquee-card-title">{item.title}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2: Right to Left (Staggered Offset) */}
          <div className="thumbnail-row row-left-to-right row-offset-2" id="marquee-row-2">
            {dupRow2.map((item, idx) => (
              <motion.div 
                className="marquee-thumbnail-card" 
                key={`r2-${item.id}-${idx}`}
                onClick={() => handleCardClick(item)}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="marquee-overlay">
                  <div className="marquee-card-title">{item.title}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 3: Left to Right (Staggered Offset) */}
          <div className="thumbnail-row row-right-to-left row-offset-3" id="marquee-row-3">
            {dupRow3.map((item, idx) => (
              <motion.div 
                className="marquee-thumbnail-card" 
                key={`r3-${item.id}-${idx}`}
                onClick={() => handleCardClick(item)}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="marquee-overlay">
                  <div className="marquee-card-title">{item.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
