"use client";

import React, { useState, useEffect } from 'react';
import { nextStore, INITIAL_DATA } from '@/lib/store';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ClientsMarquee from '@/components/ClientsMarquee';
import ThumbnailMarquee from '@/components/ThumbnailMarquee';
import WorksPortfolio from '@/components/WorksPortfolio';
import ProcessSection from '@/components/ProcessSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import Testimonials from '@/components/Testimonials';
import FaqSection from '@/components/FaqSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';
import LightboxModal from '@/components/LightboxModal';

export default function HomePage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [modalItem, setModalItem] = useState(null);
  const [isBookingModal, setIsBookingModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load local storage & sync with Firebase
    const snap = nextStore.getSnapshot();
    setData(snap);

    nextStore.syncFirestore().then(() => {
      setData(nextStore.getSnapshot());
    });
  }, []);

  const handleOpenModal = (item) => {
    setIsBookingModal(false);
    setModalItem(item);
  };

  const handleBookingSuccess = (booking) => {
    setIsBookingModal(true);
    setModalItem(booking);
    setData(nextStore.getSnapshot());
  };

  const handleCloseModal = () => {
    setModalItem(null);
  };

  return (
    <main>
      <Navbar />
      <Hero settings={data.settings} />
      <ClientsMarquee clients={data.clients} />
      <ThumbnailMarquee 
        row1={data.marqueeRow1} 
        row2={data.marqueeRow2} 
        row3={data.marqueeRow3} 
        onOpenModal={handleOpenModal} 
      />
      <ProcessSection />
      <BeforeAfterSection items={data.beforeAfter} />
      <Testimonials testimonials={data.testimonials} />
      <FaqSection faqs={data.faqs} />
      <BookingSection 
        settings={data.settings} 
        plans={data.strategyPlans || INITIAL_DATA.strategyPlans}
        onBookingSuccess={handleBookingSuccess} 
      />
      <Footer />

      <LightboxModal 
        item={modalItem} 
        onClose={handleCloseModal} 
        isBookingSuccess={isBookingModal} 
      />
    </main>
  );
}
