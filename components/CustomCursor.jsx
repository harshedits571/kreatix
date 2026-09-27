"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [hasMoved, setHasMoved] = useState(false);

  // Fast inner dot
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Trailing outer ring
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  // Premium physics configuration from EXT productions
  const dotSpringConfig = { damping: 28, stiffness: 850, mass: 0.08 };
  const ringSpringConfig = { damping: 24, stiffness: 280, mass: 0.4 };

  const dotXSpring = useSpring(dotX, dotSpringConfig);
  const dotYSpring = useSpring(dotY, dotSpringConfig);
  const ringXSpring = useSpring(ringX, ringSpringConfig);
  const ringYSpring = useSpring(ringY, ringSpringConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      setHasMoved(true);
      setIsHidden(false);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
      ringX.set(e.clientX - 16);
      ringY.set(e.clientY - 16);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName?.toLowerCase() === 'a' ||
        target.tagName?.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.filter-btn')
      ) {
        setIsHovering(true);
        setCursorText("");
      } else if (target.closest('.work-card') || target.closest('.marquee-thumbnail-card')) {
        setIsHovering(true);
        setCursorText("VIEW");
      } else if (target.closest('.ba-slider-container')) {
        setIsHovering(true);
        setCursorText("DRAG");
      } else {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [dotX, dotY, ringX, ringY]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasMoved) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{ x: dotXSpring, y: dotYSpring, opacity: isHidden ? 0 : 1 }}
        animate={{
          scale: isClicking ? 0.7 : isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      />
      <motion.div
        className="cursor-ring"
        style={{ 
          x: ringXSpring, 
          y: ringYSpring, 
          opacity: isHidden ? 0 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        animate={{
          scale: isClicking ? 0.9 : cursorText ? 2.2 : isHovering ? 1.6 : 1,
          backgroundColor: cursorText ? "#0F172A" : isHovering ? "rgba(80, 177, 255, 0.12)" : "transparent",
          borderColor: cursorText ? "#50B1FF" : isHovering ? "#50B1FF" : "rgba(15, 23, 42, 0.65)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
      >
        {cursorText && (
          <span style={{ 
            color: '#FFFFFF', 
            fontSize: '0.45rem', 
            fontWeight: 800, 
            letterSpacing: '0.08em',
            pointerEvents: 'none'
          }}>
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
}
