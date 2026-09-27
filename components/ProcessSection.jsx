'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Layers, Palette } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function ProcessSection() {
  return (
    <section className="process-section" id="process">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-badge">Streamlined Workflow</span>
          <h2 className="section-title">My <span className="highlight">Process</span></h2>
          <p className="section-desc">How we turn your raw ideas into viral, high-converting thumbnail masterpieces in 3 simple steps.</p>
        </motion.div>

        <div className="process-grid">
          
          {/* Step 01: Brief */}
          <motion.div 
            className="process-card"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <div className="process-card-step-badge step-1-badge">01</div>
            <div className="process-visual-box">
              <motion.div 
                style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', width: '85%', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', textAlign: 'left' }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#50B1FF', color: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <strong style={{ fontSize: '0.88rem', color: '#0A0F1D' }}>BRIEF</strong>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', marginLeft: 'auto' }}>(From Client)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#475569' }}>
                  <div>📄 Script & Raw Footage</div>
                  <div>🏷️ Video Title & Angle</div>
                  <div>💡 Target Audience & Emotion</div>
                  <div>🎯 Benchmark References</div>
                </div>
              </motion.div>
            </div>
            <h3 className="process-card-title">Brief</h3>
            <p className="process-card-desc">You share the video concept, script outline, and title options with us.</p>
          </motion.div>

          <motion.div 
            className="process-arrow process-arrow-1"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <ArrowRight size={32} strokeWidth={2.5} />
          </motion.div>

          {/* Step 02: Research & Sketches */}
          <motion.div 
            className="process-card"
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <div className="process-card-step-badge step-2-badge">02</div>
            <div className="process-visual-box">
              <div style={{ position: 'relative', width: '90%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div 
                  style={{ position: 'absolute', width: '70%', aspectRatio: '16/9', background: '#F1F5F9', border: '2px dashed #94A3B8', borderRadius: '8px', opacity: 0.7 }}
                  animate={{ rotate: [-6, -10, -6] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
                <motion.div 
                  style={{ position: 'relative', width: '75%', aspectRatio: '16/9', background: '#FFFFFF', border: '2px solid #9333EA', borderRadius: '10px', boxShadow: '0 8px 20px rgba(147, 51, 234, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', zIndex: 2 }}
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div style={{ width: '40px', height: '4px', background: '#CBD5E1', borderRadius: '2px', marginBottom: '6px' }}></div>
                  <div style={{ width: '60px', height: '4px', background: '#CBD5E1', borderRadius: '2px', marginBottom: '8px' }}></div>
                  <span style={{ background: '#9333EA', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>SELECTED ✓</span>
                </motion.div>
              </div>
            </div>
            <h3 className="process-card-title">Research & Sketches</h3>
            <p className="process-card-desc">We research competitor gaps and sketch multiple storyboard concepts for you to choose.</p>
          </motion.div>

          <motion.div 
            className="process-arrow process-arrow-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.3, ease: "easeInOut" }}
          >
            <ArrowRight size={32} strokeWidth={2.5} />
          </motion.div>

          {/* Step 03: Final Design */}
          <motion.div 
            className="process-card"
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <div className="process-card-step-badge step-3-badge">03</div>
            <div className="process-visual-box">
              <motion.div 
                style={{ position: 'relative', width: '90%', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 24px rgba(22, 163, 74, 0.25)', border: '2px solid #16A34A', background: '#0A0F1D' }}
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80" 
                  alt="Final render thumbnail" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#16A34A', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                  BIG RESULTS 🚀
                </div>
              </motion.div>
            </div>
            <h3 className="process-card-title">Final Design</h3>
            <p className="process-card-desc">We render 4K high-CTR artwork with custom lighting, typography, and test variations.</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
