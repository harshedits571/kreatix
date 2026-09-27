'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoveHorizontal, Sparkles } from 'lucide-react';

function SingleBeforeAfterCard({ item }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percentage = (offsetX / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging.current) {
        handleMove(e.clientX);
      }
    };
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    const handleGlobalTouchMove = (e) => {
      if (isDragging.current && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };
    const handleGlobalTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [handleMove]);

  return (
    <motion.div 
      className="ba-card"
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, boxShadow: "0 28px 60px -12px rgba(80, 177, 255, 0.25)" }}
    >
      <div 
        className="ba-slider-container" 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Concept (Wireframe Underneath) */}
        <img src={item.beforeImg} alt={`${item.title} Concept`} className="ba-image ba-image-before" loading="lazy" />
        <span className="ba-pill-badge ba-pill-concept">SKETCH CONCEPT</span>

        {/* Final Render (Overlaid with slider width) */}
        <div 
          className="ba-image-after-wrap" 
          style={{ 
            width: `${sliderPos}%`,
            transition: isDragging.current ? 'none' : 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}
        >
          <img 
            src={item.afterImg} 
            alt={`${item.title} Final`} 
            className="ba-image-after" 
            style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
            loading="lazy" 
          />
        </div>
        <span className="ba-pill-badge ba-pill-final">FINAL 4K RENDER</span>

        {/* Handle */}
        <div 
          className="ba-handle" 
          style={{ 
            left: `${sliderPos}%`,
            transition: isDragging.current ? 'none' : 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}
        >
          <motion.div 
            className="ba-handle-button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              boxShadow: '0 0 20px rgba(80, 177, 255, 0.7), 0 4px 14px rgba(0, 0, 0, 0.25)'
            }}
          >
            <ChevronLeft size={14} strokeWidth={3} />
            <ChevronRight size={14} strokeWidth={3} style={{ marginLeft: -4 }} />
          </motion.div>
        </div>
      </div>

      <div className="ba-card-info">
        <h4 className="ba-title">{item.title}</h4>
        
        {/* Quick Jump Comparison Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button 
            className="filter-btn" 
            style={{ padding: '3px 9px', fontSize: '0.72rem', height: 'auto', background: sliderPos <= 15 ? '#50B1FF' : 'rgba(15, 23, 42, 0.05)', color: sliderPos <= 15 ? '#FFF' : 'inherit' }}
            onClick={(e) => { e.stopPropagation(); setSliderPos(0); }}
          >
            Concept
          </button>
          <button 
            className="filter-btn" 
            style={{ padding: '3px 9px', fontSize: '0.72rem', height: 'auto', background: (sliderPos > 35 && sliderPos < 65) ? '#50B1FF' : 'rgba(15, 23, 42, 0.05)', color: (sliderPos > 35 && sliderPos < 65) ? '#FFF' : 'inherit' }}
            onClick={(e) => { e.stopPropagation(); setSliderPos(50); }}
          >
            50/50
          </button>
          <button 
            className="filter-btn" 
            style={{ padding: '3px 9px', fontSize: '0.72rem', height: 'auto', background: sliderPos >= 85 ? '#50B1FF' : 'rgba(15, 23, 42, 0.05)', color: sliderPos >= 85 ? '#FFF' : 'inherit' }}
            onClick={(e) => { e.stopPropagation(); setSliderPos(100); }}
          >
            Final
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BeforeAfterSection({ items = [] }) {
  return (
    <section className="before-after-section" id="before-after">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-badge">Concept to Reality</span>
          <h2 className="section-title">Before & <span className="highlight">After</span></h2>
          <p className="section-desc">Swipe and slide across to reveal how rough sketches transform into hyper-polished, viral thumbnails.</p>
        </motion.div>

        <div className="before-after-grid" id="before-after-grid">
          {items.map(item => (
            <SingleBeforeAfterCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

