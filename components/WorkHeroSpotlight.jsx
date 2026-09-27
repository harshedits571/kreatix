"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  ArrowUpRight, 
  Play, 
  Award,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

const FEATURED_SPOTLIGHTS = [
  {
    id: "kavya-waste",
    creator: "Kavya Karnatac",
    handle: "@KKCreate",
    subscribers: "2.4M Subscribers",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    niche: "Investigative Documentaries",
    title: "Inside India's TALLEST waste dump! (we were beaten 😢)",
    thumbnail: "https://images.unsplash.com/photo-1611288875785-5b89c3eb0d93?w=1200&auto=format&fit=crop&q=80",
    tag: "Documentary",
    views: "7.0M",
    ctrBoost: "+24.5% CTR",
    rank: "Rank #1 Suggested",
    strategyHeadline: "High-contrast visual tension paired with curiosity-driven facial framing",
    strategyPoints: [
      "Extracted high emotional facial expression with custom color grading to pop on dark mode feeds.",
      "Simplified visual hierarchy to 2 focal points: subject emotion + massive environmental scale.",
      "Resulted in 4.2x higher suggested video impressions within the first 48 hours."
    ]
  },
  {
    id: "mohak-mumbai",
    creator: "Mohak Mangal",
    handle: "@Mohakmangal",
    subscribers: "3.8M Subscribers",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    niche: "Current Affairs & Deep Dives",
    title: "The Lawrence Bishnoi Crime Network Explained",
    thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
    tag: "True Crime / Analysis",
    views: "4.7M",
    ctrBoost: "+18.4% CTR",
    rank: "Best Launch Q4",
    strategyHeadline: "Dark cinematic lighting with recognizable storytelling iconography",
    strategyPoints: [
      "Custom vector map overlay integrated with dramatic dual-tone lighting to signal geopolitical gravity.",
      "Zero clutter typography: let the visual intrigue do 100% of the conversion work.",
      "Average view duration increased by 2:15m due to strong packaging alignment with intro hook."
    ]
  },
  {
    id: "techburner-rig",
    creator: "Tech Burner",
    handle: "@TechBurner",
    subscribers: "11.2M Subscribers",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    niche: "Tech & Entertainment",
    title: "M4 Ultra Mac Studio vs $10,000 Custom PC Rig",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    tag: "Tech Review",
    views: "3.8M",
    ctrBoost: "+16.1% CTR",
    rank: "Trending #4 Tech",
    strategyHeadline: "Extreme product contrast & dynamic rim lighting for maximum feed punch",
    strategyPoints: [
      "3D product isolation with neon cyan/magenta backlighting to create maximum depth on mobile screens.",
      "Optimized for 1.5-second feed scan time: immediate visual clarity on 1080p and mobile feeds.",
      "Generated 740K views in the first 24 hours alone, trending #4 in YouTube Tech."
    ]
  }
];

export default function WorkHeroSpotlight({ spotlights, onSelectWork }) {
  const spotlightList = (spotlights && spotlights.length > 0) ? spotlights : FEATURED_SPOTLIGHTS;
  const [activeTab, setActiveTab] = useState(0);
  const safeIndex = Math.min(activeTab, Math.max(0, spotlightList.length - 1));
  const current = spotlightList[safeIndex] || spotlightList[0];

  if (!current) return null;

  return (
    <div className="work-spotlight-container">
      {/* Top Spotlight Channel Tabs */}
      <div className="spotlight-tabs-bar">
        <div className="spotlight-tabs-label">
          <Sparkles size={14} color="#50B1FF" />
          <span>Featured Strategy Spotlight:</span>
        </div>
        <div className="spotlight-tabs-list">
          {spotlightList.map((item, idx) => {
            const isSelected = safeIndex === idx;
            return (
              <button
                key={item.id || idx}
                className={`spotlight-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                <img src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} alt={item.creator} className="spotlight-tab-avatar" />
                <span className="spotlight-tab-name">{item.creator}</span>
                {isSelected && (
                  <motion.div 
                    layoutId="spotlightActiveTab"
                    className="spotlight-tab-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Spotlight Card (Editorial 2-Column Showcase) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="spotlight-main-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Left Column: Big Panoramic Thumbnail Preview */}
          <div className="spotlight-media-column">
            <div className="spotlight-thumb-wrap">
              <img 
                src={current.thumbnail} 
                alt={current.title} 
                className="spotlight-thumb-img"
              />
              <div className="spotlight-thumb-overlay">
                <span className="spotlight-pill-tag">{current.tag}</span>
                <div className="spotlight-pill-metrics">
                  <span className="metric-pill green">
                    <TrendingUp size={13} strokeWidth={2.5} />
                    {current.ctrBoost}
                  </span>
                  <span className="metric-pill dark">
                    <Eye size={13} />
                    {current.views}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Case Strategy Breakdown */}
          <div className="spotlight-info-column">
            <div className="spotlight-header-meta">
              <div className="spotlight-creator-strip">
                <img src={current.avatar} alt={current.creator} className="spotlight-creator-img" />
                <div>
                  <div className="spotlight-creator-name">
                    <span>{current.creator}</span>
                    <CheckCircle2 size={14} color="#50B1FF" />
                  </div>
                  <span className="spotlight-creator-sub">{current.subscribers} • {current.niche}</span>
                </div>
              </div>
              <span className="spotlight-rank-badge">
                <Award size={13} />
                {current.rank}
              </span>
            </div>

            <h3 className="spotlight-video-title">{current.title}</h3>

            <div className="spotlight-strategy-box">
              <div className="strategy-box-title">
                <Target size={14} color="#50B1FF" />
                <span>Packaging Psychology</span>
              </div>
              <p className="strategy-headline">{current.strategyHeadline}</p>
              
              <ul className="strategy-bullets-list">
                {current.strategyPoints.map((point, i) => (
                  <li key={i} className="strategy-bullet-item">
                    <span className="bullet-dot"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="spotlight-action-row">
              <div className="spotlight-metric-stat">
                <span className="stat-label">Views Generated</span>
                <span className="stat-value">{current.views}</span>
              </div>
              <div className="spotlight-metric-stat">
                <span className="stat-label">CTR Outperformance</span>
                <span className="stat-value green">{current.ctrBoost}</span>
              </div>
              <div className="spotlight-metric-stat">
                <span className="stat-label">Feed Placement</span>
                <span className="stat-value blue">Suggested #1</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
