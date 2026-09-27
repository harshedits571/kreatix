'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Lock, 
  LayoutDashboard, 
  Image as ImageIcon, 
  Layers, 
  Sliders, 
  Users, 
  Settings as SettingsIcon, 
  ExternalLink, 
  LogOut, 
  Trash2, 
  Cloud, 
  CheckCircle2, 
  X, 
  Plus,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Award,
  Edit3,
  MessageSquare
} from 'lucide-react';
import { nextStore, INITIAL_DATA } from '@/lib/store';
import { isFirebaseOnline } from '@/lib/firebase';

const ADMIN_PIN = "aryan123";

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [storeData, setStoreData] = useState(INITIAL_DATA);
  const [settingsForm, setSettingsForm] = useState(INITIAL_DATA.settings);
  const [toast, setToast] = useState(null);

  // Modals state
  const [showAddWork, setShowAddWork] = useState(false);
  const [showAddMarquee, setShowAddMarquee] = useState(false);
  const [showAddBA, setShowAddBA] = useState(false);
  const [showAddSpotlight, setShowAddSpotlight] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState(null);
  const [showAddCaseStudy, setShowAddCaseStudy] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);

  // Search filter states
  const [searchWorksQuery, setSearchWorksQuery] = useState('');
  const [searchSpotlightsQuery, setSearchSpotlightsQuery] = useState('');
  const [searchCaseStudiesQuery, setSearchCaseStudiesQuery] = useState('');
  const [searchLeadsQuery, setSearchLeadsQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Form States for creation
  const [newWork, setNewWork] = useState({
    title: '',
    creator: '',
    handle: '',
    category: 'Documentary',
    views: '10M+ Views',
    image: '',
    avatar: '',
    description: ''
  });

  const [newMarquee, setNewMarquee] = useState({
    row: '1',
    title: '',
    img: ''
  });

  const [newBA, setNewBA] = useState({
    title: '',
    category: 'Documentary',
    beforeImg: '',
    afterImg: ''
  });

  const [newSpotlight, setNewSpotlight] = useState({
    creator: '',
    handle: '',
    subscribers: '1M Subscribers',
    avatar: '',
    niche: 'Documentary & Deep Dives',
    title: '',
    thumbnail: '',
    tag: 'Documentary',
    views: '5.0M',
    ctrBoost: '+22.5% CTR',
    rank: 'Rank #1 Suggested',
    strategyHeadline: '',
    strategyPointsText: ''
  });

  const [newCaseStudy, setNewCaseStudy] = useState({
    creator: '',
    subscribers: '1M Subscribers',
    niche: 'Documentaries',
    avatar: '',
    chatMessage1: '',
    chatMessage2: '',
    chatTime: '11:42 AM • WhatsApp',
    videoTitle: '',
    videoViews: '5M views',
    videoTimeAgo: '3 months ago',
    videoThumbnail: '',
    videoDuration: '18:30',
    badgeGreen: '+22.5% CTR Surge',
    badgeBlue: 'Rank #1 on Suggested',
    articleTitle: '',
    articleDesc: '',
    articleImage: ''
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('aryan_admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
      try {
        const snap = nextStore.getSnapshot();
        if (snap) {
          setStoreData(snap);
          if (snap.settings) setSettingsForm(snap.settings);
        }
      } catch (e) {}
    }
    nextStore.syncFirestore().then(() => {
      try {
        const snap = nextStore.getSnapshot();
        if (snap) {
          setStoreData(snap);
          if (snap.settings) setSettingsForm(snap.settings);
        }
      } catch (e) {}
    });
  }, []);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PIN || pin.trim() === 'admin') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aryan_admin_auth', 'true');
      }
      showToastMsg("Welcome to Admin Dashboard! 👋");
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aryan_admin_auth');
    }
  };

  // Tab configurations
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'spotlights', label: 'Featured Spotlights', icon: Sparkles, count: storeData?.featuredSpotlights?.length || 0 },
    { id: 'case-studies', label: 'Case Studies', icon: Award, count: storeData?.caseStudies?.length || 0 },
    { id: 'works', label: 'Our Works', icon: ImageIcon, count: storeData?.works?.length || 0 },
    { id: 'marquee', label: 'Thumbnail Stream', icon: Layers, count: (storeData?.marqueeRow1?.length || 0) + (storeData?.marqueeRow2?.length || 0) },
    { id: 'before-after', label: 'Before & After', icon: Sliders, count: storeData?.beforeAfter?.length || 0 },
    { id: 'leads', label: '1-on-1 Leads', icon: Users, count: storeData?.bookings?.length || 0 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, count: null },
  ];

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await nextStore.syncFirestore();
      const snap = nextStore.getSnapshot();
      setStoreData(snap);
      setSettingsForm(snap.settings);
      showToastMsg("Data synchronized with Cloud! ☁️");
    } catch (e) {
      showToastMsg("Sync completed (local cache updated)");
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  // Filtered lists
  const displayedSpotlights = (storeData?.featuredSpotlights || []).filter(s => {
    if (!searchSpotlightsQuery.trim()) return true;
    const q = searchSpotlightsQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.creator?.toLowerCase().includes(q) ||
      s.niche?.toLowerCase().includes(q) ||
      s.handle?.toLowerCase().includes(q)
    );
  });

  const displayedCaseStudies = (storeData?.caseStudies || []).filter(cs => {
    if (!searchCaseStudiesQuery.trim()) return true;
    const q = searchCaseStudiesQuery.toLowerCase();
    return (
      cs.creator?.toLowerCase().includes(q) ||
      cs.niche?.toLowerCase().includes(q) ||
      cs.videoTitle?.toLowerCase().includes(q) ||
      cs.articleTitle?.toLowerCase().includes(q)
    );
  });

  const displayedWorks = (storeData?.works || []).filter(w => {
    if (!searchWorksQuery.trim()) return true;
    const q = searchWorksQuery.toLowerCase();
    return (
      w.title?.toLowerCase().includes(q) ||
      w.creator?.toLowerCase().includes(q) ||
      w.category?.toLowerCase().includes(q) ||
      w.handle?.toLowerCase().includes(q)
    );
  });

  const displayedLeads = (storeData?.bookings || []).filter(b => {
    if (!searchLeadsQuery.trim()) return true;
    const q = searchLeadsQuery.toLowerCase();
    return (
      b.creatorName?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.planTitle?.toLowerCase().includes(q) ||
      b.topic?.toLowerCase().includes(q)
    );
  });

  // Spotlights CRUD
  const handleCreateSpotlight = async (e) => {
    e.preventDefault();
    const points = newSpotlight.strategyPointsText
      ? newSpotlight.strategyPointsText.split('\n').map(p => p.trim()).filter(Boolean)
      : [];
    
    const spotlightItem = {
      creator: newSpotlight.creator || 'Creator Name',
      handle: newSpotlight.handle || '@Creator',
      subscribers: newSpotlight.subscribers || '1M Subscribers',
      avatar: newSpotlight.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      niche: newSpotlight.niche || 'Documentary',
      title: newSpotlight.title || 'Untitled Strategy Project',
      thumbnail: newSpotlight.thumbnail || 'https://images.unsplash.com/photo-1611288875785-5b89c3eb0d93?w=1200&auto=format&fit=crop&q=80',
      tag: newSpotlight.tag || 'Documentary',
      views: newSpotlight.views || '5.0M',
      ctrBoost: newSpotlight.ctrBoost || '+20% CTR',
      rank: newSpotlight.rank || 'Rank #1 Suggested',
      strategyHeadline: newSpotlight.strategyHeadline || 'Strategic packaging design for viral retention',
      strategyPoints: points.length > 0 ? points : ['Custom color grading to pop on dark mode feeds.', 'Optimized visual hierarchy for mobile viewers.']
    };

    await nextStore.addFeaturedSpotlight(spotlightItem);
    setStoreData(nextStore.getSnapshot());
    setShowAddSpotlight(false);
    setNewSpotlight({
      creator: '',
      handle: '',
      subscribers: '1M Subscribers',
      avatar: '',
      niche: 'Documentary & Deep Dives',
      title: '',
      thumbnail: '',
      tag: 'Documentary',
      views: '5.0M',
      ctrBoost: '+22.5% CTR',
      rank: 'Rank #1 Suggested',
      strategyHeadline: '',
      strategyPointsText: ''
    });
    showToastMsg("Featured spotlight added to Work page! 🚀");
  };

  const handleUpdateSpotlight = async (e) => {
    e.preventDefault();
    if (!editingSpotlight) return;

    const points = editingSpotlight.strategyPointsText
      ? editingSpotlight.strategyPointsText.split('\n').map(p => p.trim()).filter(Boolean)
      : (editingSpotlight.strategyPoints || []);

    const updatedData = {
      ...editingSpotlight,
      strategyPoints: points
    };
    delete updatedData.strategyPointsText;

    await nextStore.updateFeaturedSpotlight(editingSpotlight.id, updatedData);
    setStoreData(nextStore.getSnapshot());
    setEditingSpotlight(null);
    showToastMsg("Featured spotlight updated successfully! ✨");
  };

  const handleDeleteSpotlight = async (id) => {
    if (confirm("Are you sure you want to delete this strategic spotlight?")) {
      await nextStore.deleteFeaturedSpotlight(id);
      setStoreData(nextStore.getSnapshot());
      showToastMsg("Spotlight removed!");
    }
  };

  const startEditSpotlight = (spotlight) => {
    setEditingSpotlight({
      ...spotlight,
      strategyPointsText: Array.isArray(spotlight.strategyPoints)
        ? spotlight.strategyPoints.join('\n')
        : (spotlight.strategyPoints || '')
    });
  };

  // Case Studies CRUD
  const handleCreateCaseStudy = async (e) => {
    e.preventDefault();
    const item = {
      creator: newCaseStudy.creator || 'Creator Name',
      subscribers: newCaseStudy.subscribers || '1M Subscribers',
      niche: newCaseStudy.niche || 'Documentaries',
      avatar: newCaseStudy.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      chatMessage1: newCaseStudy.chatMessage1 || '',
      chatMessage2: newCaseStudy.chatMessage2 || '',
      chatTime: newCaseStudy.chatTime || '11:42 AM • WhatsApp',
      videoTitle: newCaseStudy.videoTitle || '',
      videoViews: newCaseStudy.videoViews || '',
      videoTimeAgo: newCaseStudy.videoTimeAgo || '',
      videoThumbnail: newCaseStudy.videoThumbnail || '',
      videoDuration: newCaseStudy.videoDuration || '',
      badgeGreen: newCaseStudy.badgeGreen || '',
      badgeBlue: newCaseStudy.badgeBlue || '',
      articleTitle: newCaseStudy.articleTitle || '',
      articleDesc: newCaseStudy.articleDesc || '',
      articleImage: newCaseStudy.articleImage || ''
    };

    await nextStore.addCaseStudy(item);
    setStoreData(nextStore.getSnapshot());
    setShowAddCaseStudy(false);
    setNewCaseStudy({
      creator: '',
      subscribers: '1M Subscribers',
      niche: 'Documentaries',
      avatar: '',
      chatMessage1: '',
      chatMessage2: '',
      chatTime: '11:42 AM • WhatsApp',
      videoTitle: '',
      videoViews: '5M views',
      videoTimeAgo: '3 months ago',
      videoThumbnail: '',
      videoDuration: '18:30',
      badgeGreen: '+22.5% CTR Surge',
      badgeBlue: 'Rank #1 on Suggested',
      articleTitle: '',
      articleDesc: '',
      articleImage: ''
    });
    showToastMsg("Case study added to Work page! 🎯");
  };

  const handleUpdateCaseStudy = async (e) => {
    e.preventDefault();
    if (!editingCaseStudy) return;

    await nextStore.updateCaseStudy(editingCaseStudy.id, editingCaseStudy);
    setStoreData(nextStore.getSnapshot());
    setEditingCaseStudy(null);
    showToastMsg("Case study updated successfully! ✨");
  };

  const handleDeleteCaseStudy = async (id) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      await nextStore.deleteCaseStudy(id);
      setStoreData(nextStore.getSnapshot());
      showToastMsg("Case study deleted!");
    }
  };

  // Works CRUD
  const handleCreateWork = async (e) => {
    e.preventDefault();
    await nextStore.addWork(newWork);
    setStoreData(nextStore.getSnapshot());
    setShowAddWork(false);
    setNewWork({ title: '', creator: '', handle: '', category: 'Documentary', views: '10M+ Views', image: '', avatar: '', description: '' });
    showToastMsg("New thumbnail added to portfolio! 🎉");
  };

  const handleDeleteWork = async (id) => {
    if (confirm("Are you sure you want to delete this thumbnail?")) {
      await nextStore.deleteWork(id);
      setStoreData(nextStore.getSnapshot());
      showToastMsg("Thumbnail deleted!");
    }
  };

  // Marquee CRUD
  const handleCreateMarquee = (e) => {
    e.preventDefault();
    const newItem = { id: "m_" + Date.now(), title: newMarquee.title, img: newMarquee.img };
    if (!nextStore.data.marqueeRow1) nextStore.data.marqueeRow1 = [];
    if (!nextStore.data.marqueeRow2) nextStore.data.marqueeRow2 = [];
    if (!nextStore.data.marqueeRow3) nextStore.data.marqueeRow3 = [];

    if (newMarquee.row === '1') {
      nextStore.data.marqueeRow1.push(newItem);
    } else if (newMarquee.row === '2') {
      nextStore.data.marqueeRow2.push(newItem);
    } else {
      nextStore.data.marqueeRow3.push(newItem);
    }
    nextStore.saveLocal();
    setStoreData(nextStore.getSnapshot());
    setShowAddMarquee(false);
    setNewMarquee({ row: '1', title: '', img: '' });
    showToastMsg("Slide added to marquee stream!");
  };

  const handleDeleteMarquee = (rowNum, idx) => {
    if (confirm("Remove slide from marquee?")) {
      if (rowNum === 1 && nextStore.data.marqueeRow1) nextStore.data.marqueeRow1.splice(idx, 1);
      else if (rowNum === 2 && nextStore.data.marqueeRow2) nextStore.data.marqueeRow2.splice(idx, 1);
      else if (rowNum === 3 && nextStore.data.marqueeRow3) nextStore.data.marqueeRow3.splice(idx, 1);
      nextStore.saveLocal();
      setStoreData(nextStore.getSnapshot());
      showToastMsg("Slide removed!");
    }
  };

  // Before & After CRUD
  const handleCreateBA = async (e) => {
    e.preventDefault();
    await nextStore.addBeforeAfter(newBA);
    setStoreData(nextStore.getSnapshot());
    setShowAddBA(false);
    setNewBA({ title: '', category: 'Documentary', beforeImg: '', afterImg: '' });
    showToastMsg("New Before & After pair added! 🎨");
  };

  const handleDeleteBA = async (id) => {
    if (confirm("Delete this Before & After comparison?")) {
      await nextStore.deleteBeforeAfter(id);
      setStoreData(nextStore.getSnapshot());
      showToastMsg("Comparison deleted!");
    }
  };

  // Booking status change
  const handleBookingStatusChange = async (id, status) => {
    await nextStore.updateBookingStatus(id, status);
    setStoreData(nextStore.getSnapshot());
    showToastMsg(`Lead status updated to ${status}`);
  };

  // Settings save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await nextStore.updateSettings(settingsForm);
    setStoreData(nextStore.getSnapshot());
    showToastMsg("Settings saved successfully! ✨");
  };

  // Lock Screen Render
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="lock-mesh-bg">
          <div className="lock-glow-orb lock-orb-1" />
          <div className="lock-glow-orb lock-orb-2" />
        </div>

        <motion.div 
          className="lock-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            x: pinError ? [0, -10, 10, -8, 8, -4, 4, 0] : 0
          }}
          transition={{ 
            duration: 0.45, 
            ease: [0.16, 1, 0.3, 1],
            x: { duration: 0.4 }
          }}
        >
          <div className="lock-badge-pill">
            <ShieldCheck size={14} color="#0066FF" />
            <span>Secure Admin Gateway</span>
          </div>

          <motion.div 
            className="lock-logo-badge"
            style={{ overflow: 'hidden', padding: 0 }}
            whileHover={{ scale: 1.06, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <img src="/logo.png" alt="Kreatix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          <h2 className="lock-title">Kreatix Studio CMS</h2>
          <p className="lock-desc">Enter your management passcode to access creator portfolio controls.</p>

          <form onSubmit={handleLogin} className="lock-form">
            <div className="lock-input-group">
              <div className="lock-input-label-row">
                <label htmlFor="admin-pin-input" className="lock-label">
                  Passcode / PIN
                </label>
                <button 
                  type="button" 
                  className="lock-hint-btn"
                  onClick={() => { setPin('aryan123'); setPinError(false); }}
                >
                  Fill Default (aryan123)
                </button>
              </div>

              <div className="lock-input-wrap">
                <input 
                  id="admin-pin-input"
                  type={showPassword ? "text" : "password"} 
                  className={`lock-input ${pinError ? 'input-error' : ''}`} 
                  placeholder="Enter PIN (Default: aryan123)"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                  autoFocus 
                />
                <button
                  type="button"
                  className="lock-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide PIN" : "Show PIN"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {pinError && (
              <motion.div 
                className="lock-error-msg"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={15} />
                <span>Incorrect passcode. Please try again or use default.</span>
              </motion.div>
            )}

            <motion.button 
              type="submit" 
              className="lock-submit-btn"
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Unlock Dashboard</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>
          </form>

          <div className="lock-footer-row">
            <Link href="/" className="lock-back-link">
              <ArrowLeft size={14} />
              <span>Back to Live Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Toast Notification */}
      {toast && (
        <div className="admin-toast-container">
          <div className="admin-toast">
            <CheckCircle2 size={18} color="#22C55E" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* 1. Mobile & Tablet Sticky Top App Bar (<= 1024px) */}
      <header className="admin-mobile-topbar">
        <div className="admin-mobile-brand">
          <div className="logo-badge" style={{ width: 30, height: 30, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="Kreatix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span>KREATIX CMS</span>
          <span className="admin-badge-pill">Admin</span>
        </div>

        <div className="admin-mobile-actions">
          <Link href="/work" target="_blank" className="admin-mobile-icon-btn" title="View Work Page">
            <ExternalLink size={16} />
          </Link>
          <button 
            type="button" 
            className="admin-mobile-icon-btn" 
            onClick={handleForceSync}
            title="Sync with Cloud"
          >
            <Cloud size={16} style={{ color: isSyncing ? '#50B1FF' : '#475569', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button 
            type="button" 
            className="admin-mobile-icon-btn" 
            onClick={handleLogout}
            title="Lock Dashboard"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 2. Mobile & Tablet Dedicated Horizontal Tab Dock (<= 1024px) */}
      <nav className="admin-mobile-tabs-bar" aria-label="Admin Sections">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`admin-mobile-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="admin-nav-count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Desktop Fixed Sidebar (> 1024px) */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo-badge" style={{ width: 34, height: 34, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="Kreatix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div>KREATIX CMS</div>
            <span className="admin-badge-pill">Creator Portal</span>
          </div>
        </div>

        <ul className="admin-nav">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <li 
                key={tab.id}
                className={`admin-nav-item ${isActive ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="admin-nav-item-left">
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== null && (
                  <span className="admin-nav-count">{tab.count}</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="admin-sidebar-footer">
          <Link href="/work" target="_blank" className="btn-sidebar-action btn-view-site">
            <ExternalLink size={15} />
            <span>View /work Page</span>
          </Link>
          <button type="button" className="btn-sidebar-action" onClick={handleLogout}>
            <LogOut size={15} />
            <span>Lock Dashboard</span>
          </button>
        </div>
      </aside>

      {/* 4. Main Content Area */}
      <main className="admin-main">
        
        {/* Top Header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <h1>Content Management Portal</h1>
            <p>Live controls for Featured Spotlights, Client Case Studies, thumbnail portfolio, infinite marquee stream, and strategy bookings.</p>
          </div>

          <div className="admin-header-actions">
            <div className={`sync-badge ${isFirebaseOnline ? '' : 'offline'}`}>
              <span style={{ width: 8, height: 8, background: isFirebaseOnline ? '#16A34A' : '#D97706', borderRadius: '50%', display: 'inline-block' }}></span>
              <span>{isFirebaseOnline ? "Firebase Connected" : "Local Storage Mode"}</span>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleForceSync} 
              style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            >
              <Cloud size={16} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isSyncing ? "Syncing..." : "Cloud Sync"}</span>
            </button>
            <Link href="/work" target="_blank" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.86rem' }}>
              <ExternalLink size={15} />
              <span>Live /work</span>
            </Link>
          </div>
        </div>

        {/* ==========================================================================
           TAB 1: OVERVIEW & REAL-TIME STATS
           ========================================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* Interactive Stat Cards Grid */}
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              
              {/* Stat: Spotlights */}
              <div className="admin-stat-card" onClick={() => setActiveTab('spotlights')} title="Click to view featured spotlights">
                <div className="stat-card-left">
                  <h3>{storeData?.featuredSpotlights?.length || 0}</h3>
                  <span>Featured Spotlights</span>
                </div>
                <div className="stat-card-icon-wrap stat-card-icon-blue">
                  <Sparkles size={22} />
                </div>
              </div>

              {/* Stat: Case Studies */}
              <div className="admin-stat-card" onClick={() => setActiveTab('case-studies')} title="Click to view case studies">
                <div className="stat-card-left">
                  <h3>{storeData?.caseStudies?.length || 0}</h3>
                  <span>Client Case Studies</span>
                </div>
                <div className="stat-card-icon-wrap stat-card-icon-purple">
                  <Award size={22} />
                </div>
              </div>

              {/* Stat: Works */}
              <div className="admin-stat-card" onClick={() => setActiveTab('works')} title="Click to view portfolio works">
                <div className="stat-card-left">
                  <h3>{storeData?.works?.length || 0}</h3>
                  <span>Portfolio Works</span>
                </div>
                <div className="stat-card-icon-wrap stat-card-icon-emerald">
                  <ImageIcon size={22} />
                </div>
              </div>

              {/* Stat: Marquee */}
              <div className="admin-stat-card" onClick={() => setActiveTab('marquee')} title="Click to view marquee stream">
                <div className="stat-card-left">
                  <h3>{(storeData?.marqueeRow1?.length || 0) + (storeData?.marqueeRow2?.length || 0)}</h3>
                  <span>Marquee Slides</span>
                </div>
                <div className="stat-card-icon-wrap stat-card-icon-amber">
                  <Layers size={22} />
                </div>
              </div>

              {/* Stat: Leads */}
              <div className="admin-stat-card" onClick={() => setActiveTab('leads')} title="Click to view call inquiries">
                <div className="stat-card-left">
                  <h3>{storeData?.bookings?.length || 0}</h3>
                  <span>Strategy Call Leads</span>
                </div>
                <div className="stat-card-icon-wrap stat-card-icon-blue">
                  <Users size={22} />
                </div>
              </div>

            </div>

            {/* Quick Actions Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Quick Creation & Actions</h2>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20 }}>
                Manage your work page spotlight breakdown, client WhatsApp proofs, portfolio works, and strategy packages in real-time.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => setShowAddSpotlight(true)}
                  style={{ justifyContent: 'center', padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  <Sparkles size={16} />
                  <span>+ New Strategic Spotlight</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddCaseStudy(true)}
                  style={{ justifyContent: 'center', padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  <Award size={16} />
                  <span>+ New Case Study</span>
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddWork(true)}
                  style={{ justifyContent: 'center', padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  <Plus size={16} />
                  <span>+ Add Portfolio Work</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setActiveTab('leads')}
                  style={{ justifyContent: 'center', padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  <Users size={16} />
                  <span>Review Call Bookings</span>
                </button>
              </div>
            </div>

            {/* Live Spotlights Quick Preview */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Featured Strategy Spotlights ({storeData?.featuredSpotlights?.length || 0})</h2>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('spotlights')} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  <span>Manage All Spotlights →</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {(storeData?.featuredSpotlights || []).map((s) => (
                  <div key={s.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', padding: 12 }}>
                    <div style={{ aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', background: '#0F172A', marginBottom: 10, position: 'relative' }}>
                      <img src={s.thumbnail} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#FEF3C7', color: '#B45309', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 9999 }}>
                        {s.rank}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <img src={s.avatar} alt={s.creator} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
                      <strong style={{ fontSize: '0.86rem', color: '#0F172A' }}>{s.creator}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{s.subscribers}</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, marginBottom: 6 }}>
                      {s.title}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#0284C7', fontWeight: 700 }}>{s.tag}</span>
                      <strong style={{ color: '#16A34A' }}>{s.ctrBoost}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==========================================================================
           TAB 2: FEATURED STRATEGIC SPOTLIGHTS MANAGEMENT
           ========================================================================== */}
        {activeTab === 'spotlights' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Featured Strategic Spotlights ({storeData?.featuredSpotlights?.length || 0})</h2>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>
                  Controls the top 3 high-converting strategy breakdowns and interactive spotlight cards on the <Link href="/work" target="_blank" style={{ color: '#50B1FF', fontWeight: 600 }}>/work</Link> page.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  placeholder="Search spotlights..." 
                  value={searchSpotlightsQuery}
                  onChange={(e) => setSearchSpotlightsQuery(e.target.value)}
                  style={{ width: 220 }}
                />
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => setShowAddSpotlight(true)} 
                  style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                >
                  <Plus size={16} />
                  <span>+ Add Spotlight</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
              {displayedSpotlights.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#64748B', background: '#F8FAFC', borderRadius: 16 }}>
                  No spotlights found matching your search. Click &ldquo;+ Add Spotlight&rdquo; above to create one.
                </div>
              ) : (
                displayedSpotlights.map((spotlight) => (
                  <div key={spotlight.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, overflow: 'hidden', padding: 18, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
                    
                    {/* Top Creator Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={spotlight.avatar} alt={spotlight.creator} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #50B1FF' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F172A' }}>{spotlight.creator}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>{spotlight.handle} • {spotlight.subscribers}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '3px 8px', borderRadius: 9999 }}>
                        {spotlight.rank}
                      </span>
                    </div>

                    {/* Thumbnail Preview */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: '#0F172A' }}>
                      <img src={spotlight.thumbnail} alt={spotlight.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                          {spotlight.tag}
                        </span>
                        <span style={{ background: '#22C55E', color: '#000000', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                          {spotlight.ctrBoost}
                        </span>
                      </div>
                    </div>

                    {/* Video Title */}
                    <div>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B', fontWeight: 700 }}>Video Title</span>
                      <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0F172A', lineHeight: 1.35, marginTop: 2 }}>
                        {spotlight.title}
                      </div>
                    </div>

                    {/* Strategy Headline & Points */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 12 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>
                        🧠 Packaging Psychology
                      </span>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1E293B', marginBottom: 8, lineHeight: 1.4 }}>
                        {spotlight.strategyHeadline}
                      </div>
                      <ul style={{ paddingLeft: 16, margin: 0, fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(spotlight.strategyPoints || []).map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => startEditSpotlight(spotlight)}
                        style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.84rem' }}
                      >
                        <Edit3 size={15} />
                        <span>Edit Spotlight</span>
                      </button>
                      <button 
                        type="button" 
                        className="btn-table-action delete" 
                        onClick={() => handleDeleteSpotlight(spotlight.id)}
                        title="Delete Spotlight"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==========================================================================
           TAB 3: CASE STUDIES MANAGEMENT
           ========================================================================== */}
        {activeTab === 'case-studies' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Client Case Studies & Proof ({storeData?.caseStudies?.length || 0})</h2>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>
                  Manage client testimonials, WhatsApp proof messages, and video showcase cards displayed in the case studies section.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  placeholder="Search case studies..." 
                  value={searchCaseStudiesQuery}
                  onChange={(e) => setSearchCaseStudiesQuery(e.target.value)}
                  style={{ width: 220 }}
                />
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => setShowAddCaseStudy(true)} 
                  style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                >
                  <Plus size={16} />
                  <span>+ Add Case Study</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
              {displayedCaseStudies.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#64748B', background: '#F8FAFC', borderRadius: 16 }}>
                  No case studies found. Click &ldquo;+ Add Case Study&rdquo; above to create one.
                </div>
              ) : (
                displayedCaseStudies.map((cs) => (
                  <div key={cs.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, overflow: 'hidden', padding: 18, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
                    
                    {/* Creator Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={cs.avatar} alt={cs.creator} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #10B981' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0F172A' }}>{cs.creator}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>{cs.subscribers} • {cs.niche}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>{cs.chatTime}</span>
                    </div>

                    {/* Chat Bubble Message */}
                    <div style={{ background: '#F1F5F9', borderRadius: 14, padding: 14, position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#0F172A', fontWeight: 700, fontSize: '0.8rem' }}>
                        <MessageSquare size={14} color="#10B981" />
                        <span>Client Quote / WhatsApp Feedback:</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                        &ldquo;{cs.chatMessage1}&rdquo;
                      </p>
                      {cs.chatMessage2 && (
                        <p style={{ fontSize: '0.82rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.45, marginTop: 8, marginBottom: 0 }}>
                          &ldquo;{cs.chatMessage2}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Showcase Card Preview: Video or Article */}
                    {cs.videoTitle ? (
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', padding: 10 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div style={{ width: 90, aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', background: '#0F172A', flexShrink: 0, position: 'relative' }}>
                            {cs.videoThumbnail ? (
                              <img src={cs.videoThumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : null}
                            {cs.videoDuration && (
                              <span style={{ position: 'absolute', bottom: 3, right: 3, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>
                                {cs.videoDuration}
                              </span>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {cs.videoTitle}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 2 }}>
                              {cs.videoViews} • {cs.videoTimeAgo}
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                              {cs.badgeGreen && <span style={{ background: '#DCFCE7', color: '#16A34A', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>{cs.badgeGreen}</span>}
                              {cs.badgeBlue && <span style={{ background: '#E0F2FE', color: '#0284C7', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>{cs.badgeBlue}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : cs.articleTitle ? (
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 12 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                          {cs.articleTitle}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                          {cs.articleDesc}
                        </p>
                      </div>
                    ) : null}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setEditingCaseStudy(cs)}
                        style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.84rem' }}
                      >
                        <Edit3 size={15} />
                        <span>Edit Case Study</span>
                      </button>
                      <button 
                        type="button" 
                        className="btn-table-action delete" 
                        onClick={() => handleDeleteCaseStudy(cs.id)}
                        title="Delete Case Study"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==========================================================================
           TAB 4: PORTFOLIO WORKS MANAGEMENT
           ========================================================================== */}
        {activeTab === 'works' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Portfolio Collection ({storeData?.works?.length || 0})</h2>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>Manage thumbnails displayed in the selected portfolio section.</p>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  placeholder="Search by title, creator, category..." 
                  value={searchWorksQuery}
                  onChange={(e) => setSearchWorksQuery(e.target.value)}
                  style={{ width: 240 }}
                />
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => setShowAddWork(true)} 
                  style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                >
                  <Plus size={16} />
                  <span>Add New Work</span>
                </button>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Creator / Channel</th>
                    <th>Category</th>
                    <th>Views Metric</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedWorks.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 36, color: '#64748B' }}>
                        No thumbnails found matching your search.
                      </td>
                    </tr>
                  ) : (
                    displayedWorks.map(w => (
                      <tr key={w.id}>
                        <td style={{ width: 100 }}>
                          <img src={w.image} alt={w.title} className="table-thumb-preview" />
                        </td>
                        <td>
                          <strong style={{ color: '#0F172A', display: 'block', maxWidth: 260 }}>{w.title}</strong>
                        </td>
                        <td>
                          <div className="table-creator-cell">
                            <img 
                              src={w.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                              className="table-creator-avatar" 
                              alt={w.creator} 
                            />
                            <div>
                              <div style={{ fontWeight: 700 }}>{w.creator}</div>
                              <small style={{ color: '#50B1FF', fontWeight: 600 }}>{w.handle}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="status-pill status-new">{w.category}</span>
                        </td>
                        <td>
                          <strong style={{ color: '#16A34A' }}>{w.views}</strong>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            type="button" 
                            className="btn-table-action delete" 
                            onClick={() => handleDeleteWork(w.id)} 
                            title="Delete work"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================================================
           TAB 5: THUMBNAIL STREAM MARQUEE
           ========================================================================== */}
        {activeTab === 'marquee' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Infinite Thumbnail Stream Rows</h2>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>Dual-sliding animated showcase rows on the homepage.</p>
              </div>

              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setShowAddMarquee(true)} 
                style={{ padding: '9px 18px', fontSize: '0.88rem' }}
              >
                <Plus size={16} />
                <span>Add Slide</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              
              {/* Row 1 */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#0284C7', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Row 1 (Right to Left)</span>
                  <span className="admin-nav-count">{storeData?.marqueeRow1?.length || 0}</span>
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(storeData?.marqueeRow1 || []).map((item, idx) => (
                    <div key={`m1-${item.id}-${idx}`} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={item.img} style={{ width: 72, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8 }} alt="" />
                      <div style={{ flex: 1, fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </div>
                      <button 
                        type="button" 
                        className="btn-table-action delete" 
                        onClick={() => handleDeleteMarquee(1, idx)}
                        title="Remove slide"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#9333EA', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Row 2 (Left to Right)</span>
                  <span className="admin-nav-count">{storeData?.marqueeRow2?.length || 0}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(storeData?.marqueeRow2 || []).map((item, idx) => (
                    <div key={`m2-${item.id}-${idx}`} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={item.img} style={{ width: 72, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8 }} alt="" />
                      <div style={{ flex: 1, fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </div>
                      <button 
                        type="button" 
                        className="btn-table-action delete" 
                        onClick={() => handleDeleteMarquee(2, idx)}
                        title="Remove slide"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3 */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Row 3 (Right to Left)</span>
                  <span className="admin-nav-count">{storeData?.marqueeRow3?.length || 0}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(storeData?.marqueeRow3 || []).map((item, idx) => (
                    <div key={`m3-${item.id}-${idx}`} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={item.img} style={{ width: 72, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8 }} alt="" />
                      <div style={{ flex: 1, fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </div>
                      <button 
                        type="button" 
                        className="btn-table-action delete" 
                        onClick={() => handleDeleteMarquee(3, idx)}
                        title="Remove slide"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================================================
           TAB 6: BEFORE & AFTER COMPARISONS
           ========================================================================== */}
        {activeTab === 'before-after' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Before & After Comparisons ({storeData?.beforeAfter?.length || 0})</h2>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>Interactive sketch-to-final comparison slider cards.</p>
              </div>

              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setShowAddBA(true)} 
                style={{ padding: '9px 18px', fontSize: '0.88rem' }}
              >
                <Plus size={16} />
                <span>Add Comparison Pair</span>
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project Title & Niche</th>
                    <th>Concept Wireframe (Before)</th>
                    <th>Final 4K Artwork (After)</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(storeData?.beforeAfter || []).map(ba => (
                    <tr key={ba.id}>
                      <td>
                        <strong style={{ color: '#0F172A', display: 'block' }}>{ba.title}</strong>
                        <span className="status-pill status-new" style={{ marginTop: 4 }}>{ba.category || 'Documentary'}</span>
                      </td>
                      <td>
                        <img src={ba.beforeImg} style={{ width: 90, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, border: '1.5px dashed #CBD5E1' }} alt="Concept" />
                      </td>
                      <td>
                        <img src={ba.afterImg} style={{ width: 90, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, border: '1.5px solid #50B1FF' }} alt="Final" />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          type="button" 
                          className="btn-table-action delete" 
                          onClick={() => handleDeleteBA(ba.id)} 
                          title="Delete comparison"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================================================
           TAB 7: 1-ON-1 STRATEGY CALL LEADS & PLANS
           ========================================================================== */}
        {activeTab === 'leads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Strategy Plans Management Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2>Strategy Call Pricing Packages</h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>Edit pricing, duration, and taglines displayed on public booking cards.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {(storeData.strategyPlans || []).map((plan) => (
                  <div key={plan.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <strong style={{ color: '#0F172A', fontSize: '1.02rem' }}>{plan.title}</strong>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 9999, background: '#EBF3FF', color: '#50B1FF' }}>
                        {plan.badge}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: 4 }}>Price</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          style={{ padding: '6px 10px', fontSize: '0.86rem' }}
                          value={plan.price} 
                          onChange={async (e) => {
                            const newPrice = e.target.value;
                            await nextStore.updateStrategyPlan(plan.id, { price: newPrice });
                            setStoreData(nextStore.getSnapshot());
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: 4 }}>Duration</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          style={{ padding: '6px 10px', fontSize: '0.86rem' }}
                          value={plan.duration} 
                          onChange={async (e) => {
                            const newDur = e.target.value;
                            await nextStore.updateStrategyPlan(plan.id, { duration: newDur });
                            setStoreData(nextStore.getSnapshot());
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: 4 }}>Tagline</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                        value={plan.tagline} 
                        onChange={async (e) => {
                          const newTagline = e.target.value;
                          await nextStore.updateStrategyPlan(plan.id, { tagline: newTagline });
                          setStoreData(nextStore.getSnapshot());
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookings Inquiries Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2>Call Inquiries & Confirmed Sessions ({storeData?.bookings?.length || 0})</h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>Submissions from creators reserving strategy calls.</p>
                </div>

                <input 
                  type="text" 
                  className="admin-search-input" 
                  placeholder="Filter inquiries..." 
                  value={searchLeadsQuery}
                  onChange={(e) => setSearchLeadsQuery(e.target.value)}
                  style={{ width: 220 }}
                />
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Creator & Email</th>
                      <th>Plan & Fee</th>
                      <th>Channel</th>
                      <th>Topic / Goal</th>
                      <th>Scheduled Slot</th>
                      <th>Lead Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedLeads.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#64748B', padding: 36 }}>
                          No call inquiries logged yet. Test bookings submitted on the live site will appear here in real-time.
                        </td>
                      </tr>
                    ) : (
                      displayedLeads.map(b => (
                        <tr key={b.id}>
                          <td>
                            <strong style={{ color: '#0F172A', display: 'block' }}>{b.creatorName}</strong>
                            <a href={`mailto:${b.email}`} style={{ fontSize: '0.8rem', color: '#50B1FF' }}>{b.email}</a>
                          </td>
                          <td>
                            <div><strong style={{ color: '#0F172A' }}>{b.planTitle || 'Strategy Session'}</strong></div>
                            <small style={{ color: '#16A34A', fontWeight: 700 }}>{b.amount || '₹1,999'} • {b.planDuration || '45 Mins'}</small>
                          </td>
                          <td>
                            <a href={b.channelUrl} target="_blank" rel="noreferrer" style={{ color: '#50B1FF', fontWeight: 600, textDecoration: 'underline', fontSize: '0.86rem' }}>
                              {b.channelUrl}
                            </a>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.86rem', color: '#475569' }}>{b.topic || 'Packaging Audit'}</span>
                          </td>
                          <td>
                            <div><strong>{b.preferredDate || 'TBD'}</strong></div>
                            <small style={{ color: '#64748B' }}>{b.preferredTime || ''}</small>
                          </td>
                          <td>
                            <select 
                              className="admin-select" 
                              style={{ padding: '6px 10px', fontSize: '0.82rem', borderRadius: 8, fontWeight: 700 }}
                              value={b.status}
                              onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                            >
                              <option value="New">🟢 New Lead</option>
                              <option value="Contacted">🟡 Contacted</option>
                              <option value="Scheduled">🔵 Scheduled</option>
                              <option value="Completed">⚪ Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================================================
           TAB 8: SITE SETTINGS & METRICS
           ========================================================================== */}
        {activeTab === 'settings' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Site Metrics & Content Configuration</h2>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>Edit hero headline, verified stats, designer branding, and payment keys.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Designer / Studio Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={settingsForm.designerName || ''} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, designerName: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Hero Floating Badge</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={settingsForm.heroBadge || ''} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })} 
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Hero Main Headline</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={settingsForm.heroHeadline || ''} 
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })} 
                />
              </div>

              <div className="admin-form-group">
                <label>Hero Subtext / Bio Description</label>
                <textarea 
                  className="admin-textarea" 
                  rows="3"
                  value={settingsForm.heroSubhead || ''} 
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubhead: e.target.value })} 
                ></textarea>
              </div>

              <div className="form-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="admin-form-group">
                  <label>Total Views Metric</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={settingsForm.totalViews || ''} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, totalViews: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Avg CTR Stat</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={settingsForm.avgCtr || ''} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, avgCtr: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Top Creators Count</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={settingsForm.creatorsCount || ''} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, creatorsCount: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="admin-form-group">
                  <label>1-on-1 Strategy Price Default</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={settingsForm.callPrice || ''} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, callPrice: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Razorpay Key ID (Optional)</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="rzp_live_..." 
                    value={settingsForm.razorpayKeyId || ''} 
                    onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Save All Settings ✨
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ==========================================================================
         MODAL: ADD NEW FEATURED SPOTLIGHT
         ========================================================================== */}
      {showAddSpotlight && (
        <div className="admin-modal" onClick={() => setShowAddSpotlight(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <h3 className="admin-modal-title">Add Featured Strategic Spotlight</h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B', marginTop: -14, marginBottom: 18 }}>
              This will appear in the top spotlight showcase tabs on the <strong>/work</strong> page.
            </p>

            <form onSubmit={handleCreateSpotlight}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Creator Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Kavya Karnatac" 
                    value={newSpotlight.creator}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, creator: e.target.value })}
                    required 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Handle / Channel</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. @KKCreate" 
                    value={newSpotlight.handle}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, handle: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="admin-form-group">
                  <label>Subscriber Count</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. 2.4M Subscribers" 
                    value={newSpotlight.subscribers}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, subscribers: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Niche / Category</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Investigative Documentaries" 
                    value={newSpotlight.niche}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, niche: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Creator Avatar Image URL</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input 
                    type="url" 
                    className="admin-input" 
                    placeholder="https://images.unsplash.com/... or channel avatar" 
                    value={newSpotlight.avatar}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, avatar: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {newSpotlight.avatar && (
                    <img 
                      src={newSpotlight.avatar} 
                      alt="" 
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #50B1FF' }} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Video Project Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g. Inside India's TALLEST waste dump! (we were beaten 😢)" 
                  value={newSpotlight.title}
                  onChange={(e) => setNewSpotlight({ ...newSpotlight, title: e.target.value })}
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label>High-Res Thumbnail Image URL</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  placeholder="https://images.unsplash.com/... 16:9 thumbnail" 
                  value={newSpotlight.thumbnail}
                  onChange={(e) => setNewSpotlight({ ...newSpotlight, thumbnail: e.target.value })}
                  required 
                />
                {newSpotlight.thumbnail && (
                  <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', width: 160, aspectRatio: '16/9', border: '1px solid #E2E8F0' }}>
                    <img 
                      src={newSpotlight.thumbnail} 
                      alt="Thumbnail Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="form-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                <div className="admin-form-group">
                  <label>Category Tag</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="Documentary" 
                    value={newSpotlight.tag}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, tag: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Views Count</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="7.0M" 
                    value={newSpotlight.views}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, views: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>CTR Surge Metric</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="+24.5% CTR" 
                    value={newSpotlight.ctrBoost}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, ctrBoost: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Rank / Badge</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="Rank #1 Suggested" 
                    value={newSpotlight.rank}
                    onChange={(e) => setNewSpotlight({ ...newSpotlight, rank: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Packaging Psychology Headline</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g. High-contrast visual tension paired with curiosity-driven facial framing" 
                  value={newSpotlight.strategyHeadline}
                  onChange={(e) => setNewSpotlight({ ...newSpotlight, strategyHeadline: e.target.value })}
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label>Strategy Bullet Points (1 bullet per line)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={3}
                  placeholder="Extracted high emotional facial expression with custom color grading...&#10;Simplified visual hierarchy to 2 focal points...&#10;Resulted in 4.2x higher suggested video impressions."
                  value={newSpotlight.strategyPointsText}
                  onChange={(e) => setNewSpotlight({ ...newSpotlight, strategyPointsText: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSpotlight(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Spotlight</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL: EDIT EXISTING FEATURED SPOTLIGHT
         ========================================================================== */}
      {editingSpotlight && (
        <div className="admin-modal" onClick={() => setEditingSpotlight(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <h3 className="admin-modal-title">Edit Featured Strategic Spotlight</h3>
            <form onSubmit={handleUpdateSpotlight}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Creator Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.creator || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, creator: e.target.value })}
                    required 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Handle / Channel</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.handle || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, handle: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="admin-form-group">
                  <label>Subscriber Count</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.subscribers || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, subscribers: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Niche / Category</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.niche || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, niche: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Creator Avatar Image URL</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input 
                    type="url" 
                    className="admin-input" 
                    value={editingSpotlight.avatar || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, avatar: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {editingSpotlight.avatar && (
                    <img 
                      src={editingSpotlight.avatar} 
                      alt="" 
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #50B1FF' }} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Video Project Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={editingSpotlight.title || ''}
                  onChange={(e) => setEditingSpotlight({ ...editingSpotlight, title: e.target.value })}
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label>High-Res Thumbnail Image URL</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  value={editingSpotlight.thumbnail || ''}
                  onChange={(e) => setEditingSpotlight({ ...editingSpotlight, thumbnail: e.target.value })}
                  required 
                />
                {editingSpotlight.thumbnail && (
                  <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', width: 160, aspectRatio: '16/9', border: '1px solid #E2E8F0' }}>
                    <img 
                      src={editingSpotlight.thumbnail} 
                      alt="Thumbnail Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="form-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                <div className="admin-form-group">
                  <label>Category Tag</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.tag || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, tag: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Views Count</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.views || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, views: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>CTR Surge Metric</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.ctrBoost || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, ctrBoost: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Rank / Badge</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingSpotlight.rank || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, rank: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Packaging Psychology Headline</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={editingSpotlight.strategyHeadline || ''}
                  onChange={(e) => setEditingSpotlight({ ...editingSpotlight, strategyHeadline: e.target.value })}
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label>Strategy Bullet Points (1 bullet per line)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={4}
                  value={editingSpotlight.strategyPointsText || ''}
                  onChange={(e) => setEditingSpotlight({ ...editingSpotlight, strategyPointsText: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingSpotlight(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL: ADD NEW CASE STUDY
         ========================================================================== */}
      {showAddCaseStudy && (
        <div className="admin-modal" onClick={() => setShowAddCaseStudy(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <h3 className="admin-modal-title">Add Client Case Study & Proof</h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B', marginTop: -14, marginBottom: 18 }}>
              Add a client review window with WhatsApp feedback and video metrics or article breakdown.
            </p>

            <form onSubmit={handleCreateCaseStudy}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Creator / Client Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Kavya Karnatac" 
                    value={newCaseStudy.creator}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, creator: e.target.value })}
                    required 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Subscriber Count / Subtitle</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. 2.4M Subscribers" 
                    value={newCaseStudy.subscribers}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, subscribers: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="admin-form-group">
                  <label>Niche</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Documentaries" 
                    value={newCaseStudy.niche}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, niche: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Chat Timestamp / Source</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. 11:42 AM • WhatsApp" 
                    value={newCaseStudy.chatTime}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, chatTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Creator Avatar Image URL</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input 
                    type="url" 
                    className="admin-input" 
                    placeholder="https://images.unsplash.com/..." 
                    value={newCaseStudy.avatar}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, avatar: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {newCaseStudy.avatar && (
                    <img 
                      src={newCaseStudy.avatar} 
                      alt="" 
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Client WhatsApp Feedback (Message 1)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={3}
                  placeholder="Kreatix's talent for creating thumbnails is incredible. She just gets the vibe we're going for..."
                  value={newCaseStudy.chatMessage1}
                  onChange={(e) => setNewCaseStudy({ ...newCaseStudy, chatMessage1: e.target.value })}
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label>Follow-up Message (Optional Message 2)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={2}
                  placeholder="Thanks to her, our content not only looks more professional but also feels more 'us'."
                  value={newCaseStudy.chatMessage2}
                  onChange={(e) => setNewCaseStudy({ ...newCaseStudy, chatMessage2: e.target.value })}
                />
              </div>

              {/* Video Showcase Fields */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16, marginTop: 10, marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0F172A', marginBottom: 12 }}>
                  🎥 YouTube Video Showcase (Optional / Recommended)
                </strong>

                <div className="admin-form-group">
                  <label>Showcase Video Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Inside India's TALLEST waste dump! (we were beaten 😢)" 
                    value={newCaseStudy.videoTitle}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, videoTitle: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Video Thumbnail URL</label>
                  <input 
                    type="url" 
                    className="admin-input" 
                    placeholder="https://..." 
                    value={newCaseStudy.videoThumbnail}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, videoThumbnail: e.target.value })}
                  />
                </div>

                <div className="form-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                  <div className="admin-form-group">
                    <label>Views Count</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="7M views" 
                      value={newCaseStudy.videoViews}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, videoViews: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Time Ago</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="4 months ago" 
                      value={newCaseStudy.videoTimeAgo}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, videoTimeAgo: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Video Duration</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="20:00" 
                      value={newCaseStudy.videoDuration}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, videoDuration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="admin-form-group">
                    <label>Green Metric Badge</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="+24.5% CTR Surge" 
                      value={newCaseStudy.badgeGreen}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, badgeGreen: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Blue Highlight Badge</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Rank #1 on Suggested" 
                      value={newCaseStudy.badgeBlue}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, badgeBlue: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Written Article Alternative */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0F172A', marginBottom: 12 }}>
                  📝 Or Written Case Study Article
                </strong>

                <div className="admin-form-group">
                  <label>Article Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Mohak Mangal Case Study - How I helped them?" 
                    value={newCaseStudy.articleTitle}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, articleTitle: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Article Description</label>
                  <textarea 
                    className="admin-textarea" 
                    rows={2}
                    placeholder="Working with Mohak taught me a lot about YouTube packaging strategy..."
                    value={newCaseStudy.articleDesc}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, articleDesc: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Article Image URL</label>
                  <input 
                    type="url" 
                    className="admin-input" 
                    placeholder="https://..." 
                    value={newCaseStudy.articleImage}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, articleImage: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddCaseStudy(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Case Study</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL: EDIT EXISTING CASE STUDY
         ========================================================================== */}
      {editingCaseStudy && (
        <div className="admin-modal" onClick={() => setEditingCaseStudy(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <h3 className="admin-modal-title">Edit Client Case Study</h3>
            <form onSubmit={handleUpdateCaseStudy}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Creator / Client Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingCaseStudy.creator || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, creator: e.target.value })}
                    required 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Subscriber Count / Subtitle</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingCaseStudy.subscribers || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, subscribers: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="admin-form-group">
                  <label>Niche</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingCaseStudy.niche || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, niche: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Chat Timestamp / Source</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingCaseStudy.chatTime || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, chatTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Creator Avatar Image URL</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input 
                    type="url" 
                    className="admin-input" 
                    value={editingCaseStudy.avatar || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, avatar: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {editingCaseStudy.avatar && (
                    <img 
                      src={editingCaseStudy.avatar} 
                      alt="" 
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Client WhatsApp Feedback (Message 1)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={3}
                  value={editingCaseStudy.chatMessage1 || ''}
                  onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, chatMessage1: e.target.value })}
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label>Follow-up Message (Optional Message 2)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={2}
                  value={editingCaseStudy.chatMessage2 || ''}
                  onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, chatMessage2: e.target.value })}
                />
              </div>

              {/* Video Showcase Fields */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16, marginTop: 10, marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0F172A', marginBottom: 12 }}>
                  🎥 YouTube Video Showcase
                </strong>

                <div className="admin-form-group">
                  <label>Showcase Video Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingCaseStudy.videoTitle || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, videoTitle: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Video Thumbnail URL</label>
                  <input 
                    type="url" 
                    className="admin-input" 
                    value={editingCaseStudy.videoThumbnail || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, videoThumbnail: e.target.value })}
                  />
                </div>

                <div className="form-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                  <div className="admin-form-group">
                    <label>Views Count</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={editingCaseStudy.videoViews || ''}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, videoViews: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Time Ago</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={editingCaseStudy.videoTimeAgo || ''}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, videoTimeAgo: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Video Duration</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={editingCaseStudy.videoDuration || ''}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, videoDuration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="admin-form-group">
                    <label>Green Metric Badge</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={editingCaseStudy.badgeGreen || ''}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, badgeGreen: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Blue Highlight Badge</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={editingCaseStudy.badgeBlue || ''}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, badgeBlue: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Written Article Alternative */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0F172A', marginBottom: 12 }}>
                  📝 Or Written Case Study Article
                </strong>

                <div className="admin-form-group">
                  <label>Article Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingCaseStudy.articleTitle || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, articleTitle: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Article Description</label>
                  <textarea 
                    className="admin-textarea" 
                    rows={2}
                    value={editingCaseStudy.articleDesc || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, articleDesc: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Article Image URL</label>
                  <input 
                    type="url" 
                    className="admin-input" 
                    value={editingCaseStudy.articleImage || ''}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, articleImage: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCaseStudy(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODALS: ADD WORK, ADD MARQUEE, ADD B&A
         ========================================================================== */}
      {showAddWork && (
        <div className="admin-modal" onClick={() => setShowAddWork(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Add New Thumbnail to Portfolio</h3>
            <form onSubmit={handleCreateWork}>
              <div className="admin-form-group">
                <label>Video / Project Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g. Inside India's Floating Slum" 
                  value={newWork.title}
                  onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Creator / Channel Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. KK Create" 
                    value={newWork.creator}
                    onChange={(e) => setNewWork({ ...newWork, creator: e.target.value })}
                    required 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Handle</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="@KKCreate" 
                    value={newWork.handle}
                    onChange={(e) => setNewWork({ ...newWork, handle: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Creator Profile / Avatar Image URL</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input 
                    type="url" 
                    className="admin-input" 
                    placeholder="https://images.unsplash.com/... or channel avatar link" 
                    value={newWork.avatar}
                    onChange={(e) => setNewWork({ ...newWork, avatar: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {newWork.avatar && (
                    <img 
                      src={newWork.avatar} 
                      alt="Avatar Preview" 
                      style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid #50B1FF', flexShrink: 0 }} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select 
                    className="admin-select"
                    value={newWork.category}
                    onChange={(e) => setNewWork({ ...newWork, category: e.target.value })}
                    required
                  >
                    <option value="Documentary">Documentary</option>
                    <option value="Tech">Tech</option>
                    <option value="Travel">Travel</option>
                    <option value="Podcast/Interviews">Podcast/Interviews</option>
                    <option value="Health">Health</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Views Badge</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. 12M Views" 
                    value={newWork.views}
                    onChange={(e) => setNewWork({ ...newWork, views: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Thumbnail Image URL</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  placeholder="https://images.unsplash.com/..." 
                  value={newWork.image}
                  onChange={(e) => setNewWork({ ...newWork, image: e.target.value })}
                  required 
                />
                {newWork.image && (
                  <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', width: 140, aspectRatio: '16/9', border: '1px solid #E2E8F0' }}>
                    <img 
                      src={newWork.image} 
                      alt="Thumbnail Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
              <div className="admin-form-group">
                <label>Strategy / Project Notes (Optional)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={2}
                  placeholder="Custom composition engineered for maximum CTR boost..."
                  value={newWork.description}
                  onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddWork(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Thumbnail</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMarquee && (
        <div className="admin-modal" onClick={() => setShowAddMarquee(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Add Slide to Thumbnail Stream</h3>
            <form onSubmit={handleCreateMarquee}>
              <div className="admin-form-group">
                <label>Marquee Row</label>
                <select 
                  className="admin-select"
                  value={newMarquee.row}
                  onChange={(e) => setNewMarquee({ ...newMarquee, row: e.target.value })}
                >
                  <option value="1">Row 1 (Sliding Right to Left)</option>
                  <option value="2">Row 2 (Sliding Left to Right)</option>
                  <option value="3">Row 3 (Sliding Right to Left)</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Slide Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g. 1 Left in Tokyo Luxury Penthouse" 
                  value={newMarquee.title}
                  onChange={(e) => setNewMarquee({ ...newMarquee, title: e.target.value })}
                  required 
                />
              </div>
              <div className="admin-form-group">
                <label>Image URL</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  placeholder="https://..." 
                  value={newMarquee.img}
                  onChange={(e) => setNewMarquee({ ...newMarquee, img: e.target.value })}
                  required 
                />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddMarquee(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddBA && (
        <div className="admin-modal" onClick={() => setShowAddBA(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Add Before & After Comparison</h3>
            <form onSubmit={handleCreateBA}>
              <div className="admin-form-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g. $50 to $21,873 Trading Strategy" 
                  value={newBA.title}
                  onChange={(e) => setNewBA({ ...newBA, title: e.target.value })}
                  required 
                />
              </div>
              <div className="admin-form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="Finance / Crypto" 
                  value={newBA.category}
                  onChange={(e) => setNewBA({ ...newBA, category: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Concept Sketch URL (Before)</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  placeholder="https://..." 
                  value={newBA.beforeImg}
                  onChange={(e) => setNewBA({ ...newBA, beforeImg: e.target.value })}
                  required 
                />
              </div>
              <div className="admin-form-group">
                <label>Final Thumbnail URL (After)</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  placeholder="https://..." 
                  value={newBA.afterImg}
                  onChange={(e) => setNewBA({ ...newBA, afterImg: e.target.value })}
                  required 
                />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddBA(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Comparison</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
