'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Clock, Layers, TrendingUp, FileCheck, CalendarCheck, HelpCircle } from 'lucide-react';

const FAQ_HIGHLIGHTS = {
  "f1": { icon: Clock, label: "24–48h Standard Turnaround • <12h Rush Available" },
  "f2": { icon: Layers, label: "2–3 Unique Concept Sketches • Unlimited Revisions" },
  "f3": { icon: TrendingUp, label: "Multi-Colorway & Facial Crops for YouTube A/B Tool" },
  "f4": { icon: FileCheck, label: "4K UHD WebP/PNG (<2MB Optimized) + Editable PSDs" },
  "f5": { icon: CalendarCheck, label: "45-Min Live 1-on-1 Audit + Custom Packaging Blueprint" }
};

export default function FaqSection({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-badge">
            <HelpCircle size={14} style={{ marginRight: 4 }} />
            Frequently Asked Questions
          </span>
          <h2 className="section-title">Everything You Need <span className="highlight">To Know</span></h2>
          <p className="section-desc">Clear answers on pricing, turnaround, revisions, A/B variations, and deliverables.</p>
        </motion.div>

        <div className="faq-accordion" id="faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const highlight = FAQ_HIGHLIGHTS[faq.id] || { icon: Sparkles, label: "Guaranteed Satisfaction" };
            const HighlightIcon = highlight.icon;
            const stepNum = String(index + 1).padStart(2, '0');

            return (
              <motion.div 
                className={`faq-item ${isOpen ? 'active' : ''}`} 
                key={faq.id || index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
              >
                <button 
                  className="faq-question" 
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-question-left">
                    <div className={`faq-num-pill ${isOpen ? 'active' : ''}`}>
                      {stepNum}
                    </div>
                    <span className="faq-question-text">{faq.question}</span>
                  </div>

                  <motion.div 
                    className={`faq-toggle-icon ${isOpen ? 'active' : ''}`}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  >
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      className="faq-answer-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.28, ease: "linear" }
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="faq-answer-inner">
                        <div className="faq-divider-line"></div>
                        <p className="faq-answer-text">{faq.answer}</p>
                        
                        <div className="faq-highlight-badge">
                          <HighlightIcon size={14} color="#50B1FF" strokeWidth={2.5} />
                          <span>{highlight.label}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

