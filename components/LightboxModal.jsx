'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, ArrowUpRight } from 'lucide-react';

export default function LightboxModal({ item, onClose, isBookingSuccess = false }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay active" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ zIndex: 10000 }}
      >
        <motion.div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            if (offset.y > 140 || velocity.y > 500) {
              onClose();
            }
          }}
        >
          <motion.button 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close modal"
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
          >
            <X size={20} />
          </motion.button>

          {isBookingSuccess ? (
            <div style={{ textAlign: 'center', padding: '44px 32px' }}>
              <motion.div 
                style={{ width: 72, height: 72, background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              >
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </motion.div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>1-on-1 Strategy Call Confirmed!</h2>
              <p style={{ color: '#64748B', fontSize: '0.98rem', marginBottom: 24 }}>
                Thank you <strong>{item.creatorName}</strong>! Your packaging audit session is locked in for <strong>{item.preferredDate}</strong> at <strong>{item.preferredTime}</strong>.
              </p>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, textAlign: 'left', marginBottom: 24, fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#64748B' }}>Selected Plan:</span>
                  <span style={{ fontWeight: 800, color: '#50B1FF' }}>{item.planTitle || 'Strategy Session'} ({item.amount || '₹1,999'})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#64748B' }}>Creator Channel:</span>
                  <span style={{ fontWeight: 700 }}>{item.channelUrl}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#64748B' }}>Calendar Invite:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Status:</span>
                  <span style={{ fontWeight: 700, color: '#16A34A' }}>Payment & Slot Confirmed ✓</span>
                </div>
              </div>

              <motion.button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }} 
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Awesome, See You Soon! 🚀
              </motion.button>
            </div>
          ) : (
            <>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={item.image} alt={item.title} className="modal-hero-img" />
              </div>

              <div className="modal-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img 
                      src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                      alt={item.creator}
                      style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid #50B1FF' }} 
                    />
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.creator || 'Featured Project'}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#50B1FF', fontWeight: 600 }}>{item.handle || '@YouTubeCreator'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span className="badge-views">{item.views || '10M+ Views'}</span>
                    <span className="badge-category">{item.category}</span>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12, color: '#0A0F1D' }}>{item.title}</h2>
                <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.65, marginBottom: 24 }}>
                  {item.description || 'Custom composition built with dynamic color contrast, facial psychology framing, and high-impact focal points engineered for maximum CTR boost.'}
                </p>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <motion.a 
                    href="#booking" 
                    className="btn btn-primary" 
                    onClick={onClose}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span>Get Similar High-CTR Thumbnail</span>
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </motion.a>
                  <motion.button 
                    className="btn btn-secondary" 
                    onClick={onClose}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Close Preview
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

