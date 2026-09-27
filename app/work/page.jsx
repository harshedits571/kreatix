"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  FolderOpen,
  ArrowUpRight,
  ArrowRight,
  Send,
  Award,
  Star,
  Check,
  Play,
  MessageCircle,
  BarChart2
} from 'lucide-react';

import { nextStore, INITIAL_DATA } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LightboxModal from '@/components/LightboxModal';
import WorkHeroSpotlight from '@/components/WorkHeroSpotlight';

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
  { id: 'Gaming', label: 'Gaming', icon: Gamepad2 }
];

export default function WorkPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalItem, setModalItem] = useState(null);
  const [isBookingModal, setIsBookingModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State for "Work With Me"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channelLink: '',
    budget: '$500 - $1,500',
    helpTypes: ['Thumbnail Ideation and Design'],
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const snap = nextStore.getSnapshot();
    if (snap) setData(snap);

    nextStore.syncFirestore().then(() => {
      setData(nextStore.getSnapshot());
    });
  }, []);

  const handleOpenModal = (item) => {
    setIsBookingModal(false);
    setModalItem(item);
  };

  const handleCloseModal = () => {
    setModalItem(null);
  };

  // Category computations
  const works = data.works || INITIAL_DATA.works;
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

  const handleCheckboxToggle = (type) => {
    setFormData(prev => {
      const exists = prev.helpTypes.includes(type);
      return {
        ...prev,
        helpTypes: exists ? prev.helpTypes.filter(t => t !== type) : [...prev.helpTypes, type]
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);
    const bookingLead = {
      planId: 'project-request',
      planTitle: 'Project Request',
      creatorName: formData.name,
      email: formData.email,
      channelUrl: formData.channelLink || 'N/A',
      preferredDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      preferredTime: 'Async / Email',
      amount: formData.budget,
      planDuration: 'Custom Project',
      topic: formData.helpTypes.join(', ') || 'Custom Project',
      notes: formData.notes,
      status: 'New'
    };

    const saved = await nextStore.addBooking(bookingLead);
    setSubmitting(false);

    setIsBookingModal(true);
    setModalItem({
      ...saved,
      planTitle: 'Project Request Received! 🚀',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: 'I will review your channel and reply within 12-24 hours via Email.'
    });

    setFormData({
      name: '',
      email: '',
      channelLink: '',
      budget: '₹5,000 - ₹15,000',
      helpTypes: ['Thumbnail Ideation and Design'],
      notes: ''
    });
  };

  return (
    <main style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ==========================================================================
         1. HERO HEADER: CLEAN EDITORIAL HEADLINE & CREDIBILITY STAT BAR
         ========================================================================== */}
      <section className="work-page-hero">
        <div className="container" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Top Pill Badge */}
          <div className="work-hero-badge">
            <span className="work-hero-badge-dot"></span>
            <span>PROVEN PORTFOLIO • 500M+ VIEWS GENERATED</span>
          </div>

          {/* Section Main Title */}
          <h1 className="work-hero-title">
            Crafted for High CTR. <br className="hidden md:block" />Engineered to Dominate the Feed.
          </h1>

          <p className="work-hero-subhead">
            Every thumbnail is a calculated balance of curiosity, emotional contrast, and instant visual hierarchy — turning impressions into millions of loyal viewers.
          </p>

          {/* Executive Studio Metric Bar */}
          <div className="work-stats-strip">
            <div className="work-stat-box">
              <span className="work-stat-num">500M+</span>
              <span className="work-stat-lbl">Total Views Driven</span>
            </div>
            <div className="work-stat-divider"></div>
            <div className="work-stat-box">
              <span className="work-stat-num accent-blue">18.4%</span>
              <span className="work-stat-lbl">Average CTR Surge</span>
            </div>
            <div className="work-stat-divider"></div>
            <div className="work-stat-box">
              <span className="work-stat-num accent-green">Top 1%</span>
              <span className="work-stat-lbl">Feed Suggested Rank</span>
            </div>
            <div className="work-stat-divider"></div>
            <div className="work-stat-box">
              <span className="work-stat-num">150+</span>
              <span className="work-stat-lbl">Viral Concepts Packaged</span>
            </div>
          </div>

          {/* Featured Case Strategy Spotlight */}
          <WorkHeroSpotlight 
            spotlights={data.featuredSpotlights || INITIAL_DATA.featuredSpotlights} 
            onSelectWork={handleOpenModal} 
          />

          {/* Pill Filter Tabs */}
          <div className="filter-tabs-wrapper" style={{ marginTop: 48, marginBottom: 44 }}>
            <div className="filter-tabs" role="tablist">
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
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeWorkFilterPill"
                        className="filter-active-indicator"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="filter-btn-inner">
                      <IconComponent size={15} strokeWidth={isActive ? 2.4 : 2} className={`filter-btn-icon ${isActive ? 'active' : ''}`} />
                      <span className="filter-btn-label">{cat.label}</span>
                      {count > 0 && <span className="filter-btn-count">{count}</span>}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================================================
         2. WORKS PORTFOLIO 3-COLUMN GRID
         ========================================================================== */}
      <section style={{ padding: '0 0 90px 0' }}>
        <div className="container" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
          
          <motion.div className="works-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredWorks.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#64748B' }}
                >
                  <h3>No thumbnails found in this category</h3>
                  <p style={{ marginTop: '8px' }}>Try selecting "All Designs" to explore all projects.</p>
                </motion.div>
              ) : (
                filteredWorks.map((item, index) => (
                  <motion.div 
                    className="work-card" 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                    transition={{ 
                      duration: 0.45, 
                      delay: Math.min(index * 0.04, 0.25),
                      ease: [0.16, 1, 0.3, 1],
                      layout: { type: "spring", stiffness: 350, damping: 28 } 
                    }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: "0 24px 50px -10px rgba(80, 177, 255, 0.24)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenModal(item)}
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

      {/* ==========================================================================
         3. CASE STUDIES & CREATOR CHAT BREAKDOWNS (SCREENSHOT PROOF SECTION)
         ========================================================================== */}
      {(data.caseStudies || INITIAL_DATA.caseStudies).length > 0 && (
        <section className="work-case-studies-section">
          <div className="container" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            
            <div className="section-header" style={{ marginBottom: 36, textAlign: 'center' }}>
              <span className="section-badge">Verified Case Studies</span>
              <h2 className="section-title">Creator Feedback & <span className="highlight">Packaging Results</span></h2>
              <p className="section-desc">Direct behind-the-scenes strategy, execution, and performance breakdowns.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
              {(data.caseStudies || INITIAL_DATA.caseStudies).map((cs, idx) => (
                <motion.div 
                  key={cs.id || idx}
                  className="case-study-window"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="case-window-topbar">
                    <div className="case-window-dots">
                      <span className="dot dot-red"></span>
                      <span className="dot dot-yellow"></span>
                      <span className="dot dot-green"></span>
                    </div>
                    <div className="case-window-title">Case Study • {cs.creator} ({cs.subscribers || cs.niche})</div>
                  </div>

                  <div className="case-window-body">
                    {/* Left Column: Chat Testimonials */}
                    <div className="case-chat-column">
                      <div className="chat-bubble-card">
                        <div className="chat-header">
                          <img src={cs.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} alt={cs.creator} className="chat-avatar" />
                          <div>
                            <div className="chat-sender-name">
                              {cs.creator}
                              <CheckCircle2 size={13} color="#50B1FF" />
                            </div>
                            <div className="chat-sender-role">{cs.niche || 'Creator'} • {cs.subscribers || 'Partner'}</div>
                          </div>
                        </div>
                        <p className="chat-text">
                          "{cs.chatMessage1}"
                        </p>
                        <div className="chat-time">{cs.chatTime || 'WhatsApp'}</div>
                      </div>

                      {cs.chatMessage2 && (
                        <div className="chat-bubble-card" style={{ marginTop: 14 }}>
                          <p className="chat-text">
                            "{cs.chatMessage2}"
                          </p>
                          <div className="chat-time">{cs.chatTime || 'WhatsApp'}</div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: YouTube Video Showcase Card OR Article Breakdown */}
                    <div className="case-video-column">
                      {cs.videoThumbnail ? (
                        <div className="case-yt-card">
                          <div className="case-yt-thumbnail">
                            <img 
                              src={cs.videoThumbnail} 
                              alt={cs.videoTitle || cs.creator} 
                            />
                            {cs.videoDuration && <span className="yt-timestamp">{cs.videoDuration}</span>}
                          </div>
                          <div className="case-yt-info">
                            <h4>{cs.videoTitle}</h4>
                            <p className="case-yt-meta">{cs.videoViews} • {cs.videoTimeAgo} • {cs.creator}</p>
                            <div className="case-yt-metric-strip">
                              {cs.badgeGreen && <span className="metric-badge-green">{cs.badgeGreen}</span>}
                              {cs.badgeBlue && <span className="metric-badge-blue">{cs.badgeBlue}</span>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="case-article-card">
                          <h3 className="case-article-title">{cs.articleTitle || `${cs.creator} Case Study`}</h3>
                          <p className="case-article-desc">
                            {cs.articleDesc}
                          </p>
                          {cs.articleImage && (
                            <div className="case-article-thumb-preview">
                              <img 
                                src={cs.articleImage} 
                                alt={cs.articleTitle || cs.creator} 
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ==========================================================================
         4. "WORK WITH ME" INQUIRY & CONTACT FORM SECTION
         ========================================================================== */}
      <section className="work-with-me-section" id="inquiry">
        <div className="container" style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px' }}>
          
          <div className="section-header" style={{ marginBottom: 36, textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>
              Work With Me
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
              Drop your details in the form and let's create something awesome.
            </p>
          </div>

          <motion.div 
            className="work-form-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            suppressHydrationWarning
          >
            {mounted ? (
              <form onSubmit={handleFormSubmit} suppressHydrationWarning>
                
                {/* Name */}
                <div className="form-group-item">
                  <label className="form-item-label">Name</label>
                  <input 
                    type="text" 
                    className="form-input-box" 
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                {/* Email & Channel Link */}
                <div className="form-row-2col">
                  <div className="form-group-item">
                    <label className="form-item-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input-box" 
                      placeholder="you@creator.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="form-group-item">
                    <label className="form-item-label">Link to Your YouTube Channel</label>
                    <input 
                      type="text" 
                      className="form-input-box" 
                      placeholder="https://youtube.com/@channel or channel name"
                      value={formData.channelLink}
                      onChange={(e) => setFormData({ ...formData, channelLink: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                {/* Investment Range */}
                <div className="form-group-item">
                  <label className="form-item-label">How do you see yourself investing in this project?</label>
                  <select 
                    className="form-select-box"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  >
                    <option value="₹5,000 - ₹15,000">₹5,000 - ₹15,000 (Starter Pack / Single Videos)</option>
                    <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000 (Monthly Growth Sprint)</option>
                    <option value="₹35,000 - ₹80,000+">₹35,000 - ₹80,000+ (Full Channel Packaging & Strategy Retainer)</option>
                    <option value="Custom / Long-term Retainer">Custom / Long-term Retainer</option>
                  </select>
                </div>

                {/* What kind of help are you looking for? */}
                <div className="form-group-item">
                  <label className="form-item-label">What kind of help are you looking for?</label>
                  <div className="checkbox-options-grid">
                    {[
                      "Thumbnail Ideation (no design)",
                      "Thumbnail Ideation and Design",
                      "End-to-End YouTube Packaging (Design, Title, Hook Guidance, Performance Tracking)",
                      "Something else (write in the message box below)"
                    ].map(option => {
                      const isChecked = formData.helpTypes.includes(option);
                      return (
                        <label key={option} className={`checkbox-option-label ${isChecked ? 'checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handleCheckboxToggle(option)}
                          />
                          <span className="custom-checkbox-box">
                            {isChecked && <Check size={12} strokeWidth={3} color="#FFFFFF" />}
                          </span>
                          <span className="checkbox-text">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Anything else I should know? */}
                <div className="form-group-item">
                  <label className="form-item-label">Anything else I should know?</label>
                  <textarea 
                    className="form-textarea-box" 
                    rows={4}
                    placeholder="Maybe share your current typical view counts, goals, timeline, or anything else you think I should know..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: 28 }}>
                  <button 
                    type="submit" 
                    className="work-form-submit-btn"
                    disabled={submitting}
                  >
                    <span>{submitting ? 'Sending Request...' : 'Send Message'}</span>
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </button>
                </div>

              </form>
            ) : (
              <div style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                Loading form...
              </div>
            )}
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Lightbox Modal for thumbnail clicks and form confirmation */}
      <LightboxModal 
        item={modalItem} 
        onClose={handleCloseModal} 
        isBookingSuccess={isBookingModal} 
      />

    </main>
  );
}
