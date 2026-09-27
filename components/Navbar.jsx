"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/work', label: 'Our Works' },
  { href: '/#process', label: 'My Process' },
  { href: '/#before-after', label: 'Before & After' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, itemHref) => {
    setMobileMenuOpen(false);

    // If it's a page link like /work
    if (itemHref.startsWith('/') && !itemHref.includes('#')) {
      return; // Let Next.js Link handle standard navigation
    }

    // If it's a hash link on the home page
    if (isHomePage && itemHref.includes('#')) {
      e.preventDefault();
      const targetId = itemHref.replace('/#', '').replace('#', '');

      if (typeof window !== 'undefined' && window.__lenis) {
        const el = document.getElementById(targetId);
        if (el) {
          window.__lenis.scrollTo(el, {
            offset: -85,
            duration: 1.35,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          return;
        }
      }

      const element = document.getElementById(targetId);
      if (element) {
        const navOffset = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        id="navbar"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-container">
          <Link href="/" className="brand-logo" id="nav-brand">
            <motion.div
              className="logo-badge"
              style={{ overflow: 'hidden', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              whileHover={{ scale: 1.1, rotate: 4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
            >
              <img 
                src="/logo.png" 
                alt="Kreatix Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </motion.div>
            <span>KREATIX</span>
          </Link>

          <nav className="desktop-nav">
            <ul className="nav-links">
              {NAV_ITEMS.map((item) => {
                const isWorkActive = item.href === '/work' && pathname === '/work';
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`nav-link ${isWorkActive ? 'active-page-link' : ''}`}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="nav-actions">
            <Link
              href={isHomePage ? "#booking" : "/#booking"}
              className="btn btn-primary nav-cta-btn"
              onClick={(e) => handleNavClick(e, '#booking')}
            >
              <span>Book Call</span>
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu-content">
              <ul className="mobile-nav-links">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="mobile-nav-link"
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div style={{ marginTop: '24px' }}>
                <Link
                  href={isHomePage ? "#booking" : "/#booking"}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={(e) => handleNavClick(e, '#booking')}
                >
                  <span>Book Strategy Call</span>
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
