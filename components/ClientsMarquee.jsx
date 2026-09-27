'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function ClientsMarquee({ clients = [] }) {
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <section className="clients-section">
      <motion.div 
        className="clients-title"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Trusted by Top YouTube Creators & Production Studios
      </motion.div>
      <div className="client-track" id="clients-track">
        {duplicatedClients.map((c, i) => (
          <motion.div 
            className="client-item" 
            key={`${c.id}-${i}`}
            whileHover={{ y: -3, scale: 1.03, borderColor: '#50B1FF' }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <img src={c.avatar} alt={c.name} className="client-avatar" loading="lazy" />
            <div>
              <div className="client-name">
                {c.name}
                <CheckCircle2 size={14} className="verified-icon" color="#50B1FF" />
              </div>
              <div className="client-subscribers">{c.subs}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
