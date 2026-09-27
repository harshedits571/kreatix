"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  BarChart2, 
  Award,
  Zap,
  Activity
} from 'lucide-react';

const STUDIO_PRESETS = [
  {
    id: "slum-doc",
    title: "Inside India's Floating Slum (on gutter...)",
    creator: "KK Create",
    handle: "@KKCreate",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
    timeframeLabel: "First 23 days 1 hour",
    ranking: "1 of 10",
    rankingStatus: "Top 1% of channel",
    views: {
      "24h": "1.2M",
      "28d": "6.8M",
      "lifetime": "9.5M"
    },
    viewsChange: "+420% vs typical",
    ctr: {
      "24h": "21.4%",
      "28d": "19.2%",
      "lifetime": "18.8%"
    },
    ctrBenchmark: "4.8% typical",
    duration: {
      "24h": "9:12",
      "28d": "8:42",
      "lifetime": "8:20"
    },
    retention: "72.4%",
    hookEfficiency: "88% at 0:30s",
    tag: "🔥 Slum Doc (9.5M)",
    points: [100, 92, 88, 85, 82, 79, 77, 75, 74, 72, 71]
  },
  {
    id: "crowded-slum",
    title: "Inside world's most crowded slum | Dharavi",
    creator: "KK Create",
    handle: "@KKCreate",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80",
    timeframeLabel: "First 30 days",
    ranking: "1 of 10",
    rankingStatus: "Channel's #1 All-Time Video",
    views: {
      "24h": "1.6M",
      "28d": "8.4M",
      "lifetime": "12.0M"
    },
    viewsChange: "+540% vs typical",
    ctr: {
      "24h": "24.1%",
      "28d": "22.5%",
      "lifetime": "21.9%"
    },
    ctrBenchmark: "5.1% typical",
    duration: {
      "24h": "10:30",
      "28d": "9:45",
      "lifetime": "9:15"
    },
    retention: "76.8%",
    hookEfficiency: "91% at 0:30s",
    tag: "🌟 12M Viral Hit",
    points: [100, 95, 91, 88, 85, 83, 81, 80, 78, 77, 75]
  },
  {
    id: "lawrence-crime",
    title: "The Lawrence Bishnoi Crime Network Explained",
    creator: "Mohak Mangal",
    handle: "@Mohakmangal",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    timeframeLabel: "First 14 days 8 hours",
    ranking: "1 of 10",
    rankingStatus: "Best launch this quarter",
    views: {
      "24h": "890K",
      "28d": "3.9M",
      "lifetime": "4.7M"
    },
    viewsChange: "+310% vs typical",
    ctr: {
      "24h": "19.8%",
      "28d": "18.4%",
      "lifetime": "17.6%"
    },
    ctrBenchmark: "4.2% typical",
    duration: {
      "24h": "11:04",
      "28d": "10:18",
      "lifetime": "9:54"
    },
    retention: "68.2%",
    hookEfficiency: "84% at 0:30s",
    tag: "⚡ True Crime (4.7M)",
    points: [100, 89, 84, 80, 77, 74, 72, 70, 69, 68, 66]
  },
  {
    id: "tech-mac",
    title: "M4 Ultra Mac Studio vs $10,000 Custom PC",
    creator: "Tech Burner",
    handle: "@TechBurner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    timeframeLabel: "First 7 days",
    ranking: "2 of 10",
    rankingStatus: "Trending #4 on YouTube Tech",
    views: {
      "24h": "740K",
      "28d": "2.9M",
      "lifetime": "3.8M"
    },
    viewsChange: "+245% vs typical",
    ctr: {
      "24h": "17.9%",
      "28d": "16.1%",
      "lifetime": "15.4%"
    },
    ctrBenchmark: "5.5% typical",
    duration: {
      "24h": "7:45",
      "28d": "7:12",
      "lifetime": "6:58"
    },
    retention: "64.1%",
    hookEfficiency: "81% at 0:30s",
    tag: "💻 Tech Rig (3.8M)",
    points: [100, 88, 81, 76, 73, 70, 68, 66, 65, 64, 62]
  }
];

export default function WorkHeroCollage() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [timeframe, setTimeframe] = useState('28d'); // '24h' | '28d' | 'lifetime'
  const [hoveredRetentionPoint, setHoveredRetentionPoint] = useState(null);

  const containerRef = useRef(null);

  // Mouse Parallax 3D Spring Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 140, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredRetentionPoint(null);
  };

  const currentPreset = STUDIO_PRESETS[activePresetIndex];

  // Retention sparkline path generation
  const points = currentPreset.points || [100, 90, 85, 80, 76, 73, 71, 70];
  const width = 280;
  const height = 48;
  const step = width / (points.length - 1);
  const minVal = 50;
  const maxVal = 100;
  
  const pathD = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - minVal) / (maxVal - minVal)) * (height - 8) - 4;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div 
      className="hero-interactive-stage"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      suppressHydrationWarning
    >
      {/* Dynamic Ambient Backlight Glow */}
      <div className="hero-stage-glow" suppressHydrationWarning></div>

      <motion.div 
        className="hero-3d-canvas"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        suppressHydrationWarning
      >
        {/* ====================================================================
            FLOATING THUMBNAIL CARDS IN 3D SPACE (CLICKABLE TO SWITCH PRESETS)
           ==================================================================== */}

        {/* 1. Top Left Thumbnail Card (Slum Doc) */}
        <motion.div 
          className={`float-thumb-card float-thumb-tl ${activePresetIndex === 0 ? 'is-active' : ''}`}
          onClick={() => setActivePresetIndex(0)}
          whileHover={{ scale: 1.08, zIndex: 30, y: -4 }}
          whileTap={{ scale: 0.96 }}
          title="Click to inspect YouTube Studio stats"
        >
          <div className="float-thumb-inner">
            <img src={STUDIO_PRESETS[0].image} alt="Slum Doc" />
            <div className="float-thumb-overlay">
              <span className="float-badge views">9.5M Views</span>
              <span className="float-badge rank">Rank #1</span>
            </div>
          </div>
          {activePresetIndex === 0 && <div className="float-active-glow"></div>}
        </motion.div>

        {/* 2. Top Right Thumbnail Card (Dharavi 12M) */}
        <motion.div 
          className={`float-thumb-card float-thumb-tr ${activePresetIndex === 1 ? 'is-active' : ''}`}
          onClick={() => setActivePresetIndex(1)}
          whileHover={{ scale: 1.08, zIndex: 30, y: -4 }}
          whileTap={{ scale: 0.96 }}
          title="Click to inspect YouTube Studio stats"
        >
          <div className="float-thumb-inner">
            <img src={STUDIO_PRESETS[1].image} alt="Dharavi Doc" />
            <div className="float-thumb-overlay">
              <span className="float-badge views">12M Views</span>
              <span className="float-badge ctr">+22.5% CTR</span>
            </div>
          </div>
          {activePresetIndex === 1 && <div className="float-active-glow"></div>}
        </motion.div>

        {/* 3. Bottom Left Thumbnail Card (Tech Rig) */}
        <motion.div 
          className={`float-thumb-card float-thumb-bl ${activePresetIndex === 3 ? 'is-active' : ''}`}
          onClick={() => setActivePresetIndex(3)}
          whileHover={{ scale: 1.08, zIndex: 30, y: -4 }}
          whileTap={{ scale: 0.96 }}
          title="Click to inspect YouTube Studio stats"
        >
          <div className="float-thumb-inner">
            <img src={STUDIO_PRESETS[3].image} alt="Tech Review" />
            <div className="float-thumb-overlay">
              <span className="float-badge views">3.8M Views</span>
              <span className="float-badge tag">Tech</span>
            </div>
          </div>
          {activePresetIndex === 3 && <div className="float-active-glow"></div>}
        </motion.div>

        {/* 4. Bottom Right Thumbnail Card (Lawrence Crime) */}
        <motion.div 
          className={`float-thumb-card float-thumb-br ${activePresetIndex === 2 ? 'is-active' : ''}`}
          onClick={() => setActivePresetIndex(2)}
          whileHover={{ scale: 1.08, zIndex: 30, y: -4 }}
          whileTap={{ scale: 0.96 }}
          title="Click to inspect YouTube Studio stats"
        >
          <div className="float-thumb-inner">
            <img src={STUDIO_PRESETS[2].image} alt="Crime Doc" />
            <div className="float-thumb-overlay">
              <span className="float-badge views">4.7M Views</span>
              <span className="float-badge ctr">18.4% CTR</span>
            </div>
          </div>
          {activePresetIndex === 2 && <div className="float-active-glow"></div>}
        </motion.div>

        {/* 5. Ambient Left Background Card */}
        <div className="float-thumb-card float-thumb-ml-bg">
          <div className="float-thumb-inner">
            <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80" alt="Floating City" />
            <div className="float-thumb-overlay">
              <span className="float-badge views">4.4M Views</span>
            </div>
          </div>
        </div>

        {/* 6. Ambient Right Background Card */}
        <div className="float-thumb-card float-thumb-mr-bg">
          <div className="float-thumb-inner">
            <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80" alt="Japan Travel" />
            <div className="float-thumb-overlay">
              <span className="float-badge views">5.1M Views</span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            CENTRAL INTERACTIVE YOUTUBE STUDIO PERFORMANCE CARD
           ==================================================================== */}
        <div className="studio-interactive-card">
          {/* Top Status & Timeframe Filter Bar */}
          <div className="studio-top-bar">
            <div className="studio-live-indicator">
              <span className="live-dot-pulse"></span>
              <span className="live-text">Live Video Performance</span>
            </div>

            {/* Timeframe selector tabs */}
            <div className="studio-time-pills">
              <button 
                className={`time-pill ${timeframe === '24h' ? 'active' : ''}`}
                onClick={() => setTimeframe('24h')}
              >
                24h
              </button>
              <button 
                className={`time-pill ${timeframe === '28d' ? 'active' : ''}`}
                onClick={() => setTimeframe('28d')}
              >
                28d
              </button>
              <button 
                className={`time-pill ${timeframe === 'lifetime' ? 'active' : ''}`}
                onClick={() => setTimeframe('lifetime')}
              >
                Lifetime
              </button>
            </div>
          </div>

          {/* Active Video Header Bar */}
          <div className="studio-video-header">
            <div className="studio-video-thumb">
              <img src={currentPreset.image} alt={currentPreset.title} />
              <div className="studio-thumb-play">
                <Play size={10} fill="#FFF" color="#FFF" />
              </div>
            </div>
            <div className="studio-video-info">
              <div className="studio-video-title" title={currentPreset.title}>
                {currentPreset.title}
              </div>
              <div className="studio-channel-tag">
                <img src={currentPreset.avatar} alt={currentPreset.creator} className="studio-creator-avatar" />
                <span>{currentPreset.handle}</span>
                <CheckCircle2 size={12} color="#50B1FF" />
                <span className="studio-timeframe-sub">• {currentPreset.timeframeLabel}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Rows */}
          <div className="studio-metrics-table">
            
            {/* Row 1: Ranking */}
            <div className="studio-row">
              <div className="studio-row-left">
                <span className="studio-row-title">Ranking by views</span>
                <span className="studio-row-sub">{currentPreset.rankingStatus}</span>
              </div>
              <div className="studio-row-right">
                <span className="studio-row-badge gold">
                  <Award size={13} />
                  {currentPreset.ranking}
                </span>
              </div>
            </div>

            {/* Row 2: Views */}
            <div className="studio-row">
              <div className="studio-row-left">
                <span className="studio-row-title">Views</span>
                <span className="studio-row-sub green-sub">{currentPreset.viewsChange}</span>
              </div>
              <div className="studio-row-right">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={`${currentPreset.id}-${timeframe}-views`}
                    className="studio-val-primary green"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentPreset.views[timeframe]} <span className="arrow-up">▲</span>
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Row 3: Impressions Click-Through Rate */}
            <div className="studio-row">
              <div className="studio-row-left">
                <span className="studio-row-title">Impressions click-through rate</span>
                <span className="studio-row-sub">{currentPreset.ctrBenchmark}</span>
              </div>
              <div className="studio-row-right">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={`${currentPreset.id}-${timeframe}-ctr`}
                    className="studio-val-primary green"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentPreset.ctr[timeframe]} <span className="arrow-up">▲</span>
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Row 4: Average view duration */}
            <div className="studio-row no-border">
              <div className="studio-row-left">
                <span className="studio-row-title">Average view duration</span>
                <span className="studio-row-sub">Retention: {currentPreset.retention}</span>
              </div>
              <div className="studio-row-right">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={`${currentPreset.id}-${timeframe}-dur`}
                    className="studio-val-primary green"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentPreset.duration[timeframe]} <span className="arrow-up">▲</span>
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Interactive Audience Retention Sparkline Chart */}
          <div className="studio-chart-wrapper">
            <div className="studio-chart-header">
              <span className="chart-title">
                <Activity size={12} color="#22C55E" /> Audience Retention Curve
              </span>
              <span className="chart-stat">
                Hook: <strong>{currentPreset.hookEfficiency}</strong>
              </span>
            </div>

            <div 
              className="sparkline-container"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const xPos = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const pct = xPos / rect.width;
                const pointIdx = Math.min(points.length - 1, Math.floor(pct * points.length));
                const val = points[pointIdx];
                const sec = Math.floor(pct * 600); // 10 min scale
                const mins = Math.floor(sec / 60);
                const secs = (sec % 60).toString().padStart(2, '0');
                setHoveredRetentionPoint({
                  x: xPos,
                  timestamp: `${mins}:${secs}`,
                  retention: `${val}%`
                });
              }}
              onMouseLeave={() => setHoveredRetentionPoint(null)}
            >
              <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="studioChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#studioChartGrad)" />
                <path d={pathD} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Scrubber Tooltip & Line */}
              {hoveredRetentionPoint && (
                <div 
                  className="sparkline-scrubber"
                  style={{ left: `${hoveredRetentionPoint.x}px` }}
                >
                  <div className="scrubber-line"></div>
                  <div className="scrubber-dot"></div>
                  <div className="scrubber-tooltip">
                    {hoveredRetentionPoint.timestamp} • {hoveredRetentionPoint.retention}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Case Study Selector Chips */}
          <div className="studio-presets-row">
            <span className="presets-label">Explore Case:</span>
            <div className="presets-chips">
              {STUDIO_PRESETS.map((preset, idx) => {
                const isSelected = activePresetIndex === idx;
                return (
                  <button
                    key={preset.id}
                    className={`preset-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setActivePresetIndex(idx)}
                  >
                    {preset.tag}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
