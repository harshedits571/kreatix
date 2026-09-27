'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Testimonials({ testimonials = [] }) {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-badge">Client Proof</span>
          <h2 className="section-title">Loved by <span className="highlight">Top Creators</span></h2>
          <p className="section-desc">Hear what leading YouTubers and production houses say about partnering with Kreatix.</p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((item, idx) => (
            <motion.div 
              className="testimonial-card" 
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, boxShadow: "0 20px 48px -10px rgba(80, 177, 255, 0.16)" }}
            >
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "{item.text}"
              </p>
              <div className="testimonial-author">
                <img src={item.avatar} alt={item.author} className="author-avatar" />
                <div>
                  <div className="author-name">{item.author}</div>
                  <div className="author-channel">{item.channel}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
