'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Film, 
  Laptop, 
  Compass, 
  Mic, 
  HeartPulse, 
  Gamepad2, 
  FolderOpen 
} from 'lucide-react';

const CATEGORY_MAP = {
  all: { label: 'All Designs', icon: Sparkles },
  documentary: { label: 'Documentary', icon: Film },
  tech: { label: 'Tech', icon: Laptop },
  travel: { label: 'Travel', icon: Compass },
  'podcast/interviews': { label: 'Podcast/Interviews', icon: Mic },
  podcast: { label: 'Podcast', icon: Mic },
  health: { label: 'Health', icon: HeartPulse },
  gaming: { label: 'Gaming', icon: Gamepad2 }
};

const BASE_CATEGORIES = [
  { id: 'all', label: 'All Designs', icon: Sparkles },
  { id: 'Documentary', label: 'Documentary', icon: Film },
  { id: 'Tech', label: 'Tech', icon: Laptop },
  { id: 'Travel', label: 'Travel', icon: Compass },
  { id: 'Podcast/Interviews', label: 'Podcast/Interviews', icon: Mic },
  { id: 'Health', label: 'Health', icon: HeartPulse },
  { id: 'Gaming', label: 'Gaming', icon: Gamepad2 }
];

export default function WorksPortfolio({ works = [], onOpenModal }) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Also include any dynamic categories from works that aren't in BASE_CATEGORIES
  const workCategories = Array.from(new Set(works.map(w => w.category).filter(Boolean)));
  const extraCategories = workCategories
    .filter(cat => !BASE_CATEGORIES.some(b => b.id.toLowerCase() === cat.toLowerCase()))
    .map(cat => ({
      id: cat,
      label: cat,
      icon: CATEGORY_MAP[cat.toLowerCase()]?.icon || FolderOpen
    }));

  const allCategories = [...BASE_CATEGORIES, ...extraCategories];

  const filteredWorks = activeCategory === 'all'
    ? works
    : works.filter(w => w.category.toLowerCase() === activeCategory.toLowerCase());

  const getCategoryCount = (catId) => {
    if (catId === 'all') return works.length;
    return works.filter(w => w.category.toLowerCase() === catId.toLowerCase()).length;
  };

  return (
    <section className="works-section" id="works">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-badge">Selected Portfolio</span>
          <h2 className="section-title">Proven Designs, <span className="highlight">Explosive Results</span></h2>
          <p className="section-desc">Explore past thumbnail case studies with verified creator views and CTR metrics.</p>
        </motion.div>

        {/* Pill Category Tabs with Morphing Floating Dock */}
        <motion.div 
          className="filter-tabs-wrapper"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="filter-tabs" id="portfolio-filters" role="tablist">
            {allCategories.map(cat => {
              const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
              const count = getCategoryCount(cat.id);
              const IconComponent = cat.icon || Sparkles;

              return (
                <motion.button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 450, damping: 26 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="filter-active-indicator"
                      transition={{ 
                        type: "spring", 
                        stiffness: 380, 
                        damping: 30 
                      }}
                    />
                  )}
                  <span className="filter-btn-inner">
                    <IconComponent 
                      size={15} 
                      strokeWidth={isActive ? 2.4 : 2} 
                      className={`filter-btn-icon ${isActive ? 'active' : ''}`} 
                    />
                    <span className="filter-btn-label">{cat.label}</span>
                    {count > 0 && (
                      <span className="filter-btn-count">
                        {count}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Works Grid with Layout Spring Animations */}
        <motion.div 
          className="works-grid" 
          id="works-grid"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredWorks.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#64748B' }}
              >
                <h3>No thumbnails in this category yet</h3>
                <p style={{ marginTop: '8px' }}>Switch categories or add new designs via the Admin panel.</p>
              </motion.div>
            ) : (
              filteredWorks.map((item, index) => (
                <motion.div 
                  className="work-card" 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                  transition={{ 
                    duration: 0.45, 
                    delay: Math.min(index * 0.04, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                    layout: { type: "spring", stiffness: 350, damping: 28 } 
                  }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    boxShadow: "0 28px 55px -12px rgba(80, 177, 255, 0.28)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenModal && onOpenModal(item)}
                >
                  <div className="work-thumb-wrapper">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  
                  <div className="work-meta-row">
                    <img 
                      src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                      alt={item.creator} 
                      className="work-creator-avatar" 
                    />
                    <div className="work-meta-info">
                      <h3 className="work-title" title={item.title}>{item.title}</h3>
                      <div className="work-creator-name">
                        {item.handle || item.creator}
                        <CheckCircle2 size={13} color="#50B1FF" />
                      </div>
                    </div>
                  </div>

                  <div className="work-badges-row">
                    <div className="badge-views">
                      <span>{item.views}</span>
                      <span className="growth-icon">
                        <TrendingUp size={14} strokeWidth={2.5} />
                      </span>
                    </div>
                    <div className="badge-category">
                      <span>{item.category}</span>
                      <Eye size={14} strokeWidth={2} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

