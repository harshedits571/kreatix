'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  User, 
  Mail, 
  Youtube, 
  Target, 
  ArrowUpRight, 
  Zap, 
  X, 
  Sparkles 
} from 'lucide-react';
import { nextStore } from '@/lib/store';

const DEFAULT_PLANS = [
  {
    id: "plan-starter",
    title: "Starter CTR Audit",
    badge: "⚡ Quick Start",
    duration: "30 Mins",
    price: "₹999",
    amount: 999,
    popular: false,
    tagline: "Immediate packaging diagnostic & quick CTR boost fixes.",
    features: [
      "30-Minute 1-on-1 screen share audit",
      "Analysis of lowest vs highest CTR videos",
      "2 tailored title & thumbnail frameworks",
      "Instant Google Meet recording provided"
    ]
  },
  {
    id: "plan-pro",
    title: "Pro Packaging Blueprint",
    badge: "🔥 Most Popular",
    duration: "45 Mins",
    price: "₹1,999",
    amount: 1999,
    popular: true,
    tagline: "The complete visual storytelling overhaul for high growth.",
    features: [
      "45-Minute deep dive channel revamp & audit",
      "5 custom high-converting thumbnail frameworks",
      "Competitor colorway & facial framing playbook",
      "YouTube A/B testing test-matrix for next 5 videos",
      "Instant Meet recording + Notion action plan"
    ]
  },
  {
    id: "plan-vip",
    title: "VIP Scaling Sprint",
    badge: "💎 Ultimate Value",
    duration: "90 Mins",
    price: "₹4,999",
    amount: 4999,
    popular: false,
    tagline: "Complete channel packaging redesign & priority VIP support.",
    features: [
      "90-Minute intensive channel redesign sprint",
      "10 custom viral thumbnail storyboard wireframes",
      "Live thumbnail design breakdown in Photoshop",
      "Priority WhatsApp access for 14 days post-call",
      "Custom brand colorway & typography asset kit"
    ]
  }
];

const TIME_SLOTS = [
  '11:00 AM IST',
  '02:00 PM IST',
  '05:00 PM IST',
  '07:00 PM IST',
  '09:00 PM IST',
  '10:30 PM IST'
];

export default function BookingSection({ settings, plans = DEFAULT_PLANS, onBookingSuccess }) {
  const activePlans = (plans && plans.length > 0) ? plans : DEFAULT_PLANS;
  const [selectedPlanId, setSelectedPlanId] = useState(activePlans[1]?.id || activePlans[0]?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channel: '',
    topic: '',
    date: '',
    time: '07:00 PM IST'
  });
  const [loading, setLoading] = useState(false);

  const selectedPlan = activePlans.find(p => p.id === selectedPlanId) || activePlans[0];

  useEffect(() => {
    setMounted(true);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setFormData(prev => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }));
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleOpenPlanModal = (planId) => {
    setSelectedPlanId(planId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingPayload = {
      planId: selectedPlan.id,
      planTitle: selectedPlan.title,
      planDuration: selectedPlan.duration,
      creatorName: formData.name,
      email: formData.email,
      channelUrl: formData.channel,
      topic: formData.topic,
      preferredDate: formData.date,
      preferredTime: formData.time,
      amount: selectedPlan.price,
      status: "New",
      paymentStatus: "Completed"
    };

    // Razorpay Integration Hook
    if (typeof window !== 'undefined' && window.Razorpay && settings?.razorpayKeyId && !settings.razorpayKeyId.includes('placeholder')) {
      const options = {
        key: settings.razorpayKeyId,
        amount: (selectedPlan.amount || 1999) * 100,
        currency: "INR",
        name: `${settings?.designerName || 'Kreatix'} - ${selectedPlan.title}`,
        description: `${selectedPlan.duration} 1-on-1 YouTube Packaging Strategy Session`,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        handler: async function (response) {
          bookingPayload.paymentId = response.razorpay_payment_id || `sim_${Date.now()}`;
          bookingPayload.paymentStatus = "Completed";
          await nextStore.addBooking(bookingPayload);
          setLoading(false);
          setIsModalOpen(false);
          if (onBookingSuccess) onBookingSuccess(bookingPayload);
          setFormData({ name: '', email: '', channel: '', topic: '', date: '', time: '07:00 PM IST' });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#50B1FF"
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Direct Booking Simulation & Firestore Storage
      setTimeout(async () => {
        await nextStore.addBooking(bookingPayload);
        setLoading(false);
        setIsModalOpen(false);
        if (onBookingSuccess) onBookingSuccess(bookingPayload);
        setFormData({ name: '', email: '', channel: '', topic: '', date: '', time: '07:00 PM IST' });
      }, 700);
    }
  };

  return (
    <section className="booking-section" id="booking">
      <div className="container">
        
        {/* Section Header */}
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-badge">
            <Zap size={14} style={{ marginRight: 4 }} />
            1-on-1 Creator Strategy
          </span>
          <h2 className="section-title">Select Your Call Plan, <span className="highlight">Unlock Explosive CTR</span></h2>
          <p className="section-desc">Pick the ideal packaging strategy session tailored to your channel scale and upcoming releases.</p>
        </motion.div>

        {/* 3 White & Blue Strategy Call Plan Cards */}
        <div className="plans-cards-grid">
          {activePlans.map((plan, idx) => {
            const isPopular = plan.popular;
            return (
              <motion.div 
                key={plan.id}
                className={`plan-card-white ${isPopular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -7 }}
              >
                {/* Top Row: Badge & Duration */}
                <div className="plan-card-top-row">
                  <span className={`plan-badge-pill-white ${isPopular ? 'popular-pill' : ''}`}>
                    {plan.badge}
                  </span>
                  <span className="plan-duration-pill-white">
                    <Clock size={13} style={{ color: '#50B1FF' }} />
                    {plan.duration}
                  </span>
                </div>

                <h3 className="plan-card-title-white">{plan.title}</h3>
                <p className="plan-card-tagline-white">{plan.tagline}</p>

                <div className="plan-price-row-white">
                  <span className="plan-price-val-white">{plan.price}</span>
                  <span className="plan-price-unit-white">/ session</span>
                </div>

                {/* Features List */}
                <ul className="plan-features-list-white">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="plan-feature-item-white">
                      <div className="feature-check-icon-white">
                        <Check size={13} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button: Triggers Details Popup Modal */}
                <motion.button 
                  type="button" 
                  className={`plan-cta-btn ${isPopular ? 'plan-cta-btn-primary' : 'plan-cta-btn-secondary'}`}
                  onClick={() => handleOpenPlanModal(plan.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Select This Plan</span>
                  <ArrowUpRight size={17} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Booking Details Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="booking-modal-overlay"
            onClick={() => setIsModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.div 
              className="booking-modal-container"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.93, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {/* Modal Close Button */}
              <button 
                type="button" 
                className="booking-modal-close" 
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="booking-modal-header">
                <span className="booking-modal-badge">
                  <Sparkles size={13} style={{ marginRight: 4 }} />
                  Reserve Your Session
                </span>
                <h3 className="booking-modal-title">Book Your 1-on-1 Strategy Call</h3>
                <p className="booking-modal-desc">Fill in your channel details and pick your preferred time slot.</p>
              </div>

              {/* Selected Plan Banner Strip */}
              <div className="booking-modal-plan-strip">
                <div className="modal-plan-strip-left">
                  <div className="modal-live-dot"></div>
                  <div>
                    <span className="modal-plan-label">Selected Strategy Plan</span>
                    <strong className="modal-plan-name">{selectedPlan.title}</strong>
                  </div>
                </div>
                <div className="modal-plan-strip-right">
                  <span className="modal-plan-duration-badge">
                    <Clock size={12} />
                    {selectedPlan.duration}
                  </span>
                  <span className="modal-plan-price-tag">{selectedPlan.price}</span>
                </div>
              </div>

              {/* Booking Form */}
              {mounted && (
                <form onSubmit={handleSubmit} className="booking-modal-form">
                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label className="modal-form-label" htmlFor="popup-booking-name">
                        <User size={13} className="label-icon" />
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        id="popup-booking-name" 
                        className="modal-form-input" 
                        placeholder="e.g. Aryan Sharma" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required 
                      />
                    </div>

                    <div className="modal-form-group">
                      <label className="modal-form-label" htmlFor="popup-booking-email">
                        <Mail size={13} className="label-icon" />
                        Email Address (for Meet invite)
                      </label>
                      <input 
                        type="email" 
                        id="popup-booking-email" 
                        className="modal-form-input" 
                        placeholder="creator@youtube.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required 
                      />
                    </div>
                  </div>

                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label className="modal-form-label" htmlFor="popup-booking-channel">
                        <Youtube size={13} className="label-icon" />
                        YouTube Channel Link / Handle
                      </label>
                      <input 
                        type="text" 
                        id="popup-booking-channel" 
                        className="modal-form-input" 
                        placeholder="https://youtube.com/@yourchannel" 
                        value={formData.channel}
                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                        required 
                      />
                    </div>

                    <div className="modal-form-group">
                      <label className="modal-form-label" htmlFor="popup-booking-topic">
                        <Target size={13} className="label-icon" />
                        Topic / Current CTR Bottleneck
                      </label>
                      <input 
                        type="text" 
                        id="popup-booking-topic" 
                        className="modal-form-input" 
                        placeholder="e.g. Documentary CTR stuck at 4%" 
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        required 
                      />
                    </div>
                  </div>

                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label className="modal-form-label" htmlFor="popup-booking-date">
                        <Calendar size={13} className="label-icon" />
                        Preferred Date
                      </label>
                      <input 
                        type="date" 
                        id="popup-booking-date" 
                        className="modal-form-input" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required 
                      />
                    </div>

                    <div className="modal-form-group">
                      <label className="modal-form-label">
                        <Clock size={13} className="label-icon" />
                        Preferred Time Slot (IST)
                      </label>
                      <div className="modal-time-slots-grid">
                        {TIME_SLOTS.map((t) => {
                          const isSelected = formData.time === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setFormData({ ...formData, time: t })}
                              className={`modal-time-slot-btn ${isSelected ? 'selected' : ''}`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <motion.button 
                    type="submit" 
                    className="modal-submit-btn" 
                    disabled={loading}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <span>{loading ? "Securing Slot..." : `Lock In ${selectedPlan.title} (${selectedPlan.price})`}</span>
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </motion.button>

                  <div className="modal-guarantee-row">
                    <ShieldCheck size={16} color="#16A34A" />
                    <span>Instant Google Meet invite • 100% Actionable Strategy Guarantee</span>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
