"use client";

import { useRef, useEffect, useState } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
  const divRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Utility functions for pointer tracking (from CH Bot)
  const centerOfElement = ($el) => {
    const { width, height } = $el.getBoundingClientRect();
    return [width/2, height/2];
  };

  const pointerPositionRelativeToElement = ($el, e) => {
    const pos = [e.clientX, e.clientY];
    const { left, top, width, height } = $el.getBoundingClientRect();
    const x = pos[0] - left;
    const y = pos[1] - top;
    const px = clamp((100 / width) * x);
    const py = clamp((100 / height) * y);
    return { pixels: [x,y], percent: [px,py] };
  };

  const angleFromPointerEvent = ($el, dx, dy) => {
    let angleRadians = 0;
    let angleDegrees = 0;
    if (dx !== 0 || dy !== 0) {
      angleRadians = Math.atan2(dy, dx);
      angleDegrees = angleRadians * (180 / Math.PI) + 90;
      if (angleDegrees < 0) {
        angleDegrees += 360;
      }
    }
    return angleDegrees;
  };

  const distanceFromCenter = ($card, x, y) => {
    const [cx,cy] = centerOfElement($card);
    return [x - cx, y - cy];
  };

  const closenessToEdge = ($card, x, y) => {
    const [cx,cy] = centerOfElement($card);
    const [dx,dy] = distanceFromCenter($card, x, y);
    let k_x = Infinity;
    let k_y = Infinity;
    if (dx !== 0) {
      k_x = cx / Math.abs(dx);
    }    
    if (dy !== 0) {
      k_y = cy / Math.abs(dy);
    }
    return clamp((1 / Math.min(k_x, k_y)), 0, 1);
  };

  const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

  const clamp = (value, min = 0, max = 100) =>
    Math.min(Math.max(value, min), max);

  const handleMouseMove = e => {
    const card = divRef.current;
    if (!card) return;

    // Get the bounding rect and ensure we're using the correct element
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp coordinates to be within the card bounds
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));

    // Original spotlight effect - use clamped coordinates
    card.style.setProperty('--mouse-x', `${clampedX}px`);
    card.style.setProperty('--mouse-y', `${clampedY}px`);
    card.style.setProperty('--spotlight-color', spotlightColor);

    // Enhanced glow effect (from CH Bot) - use original coordinates for calculations
    const position = pointerPositionRelativeToElement(card, e);
    const [px, py] = position.pixels;
    const [perx, pery] = position.percent;
    const [dx, dy] = distanceFromCenter(card, px, py);
    const edge = closenessToEdge(card, px, py);
    const angle = angleFromPointerEvent(card, dx, dy);

    card.style.setProperty('--pointer-x', `${round(perx)}%`);
    card.style.setProperty('--pointer-y', `${round(pery)}%`);
    card.style.setProperty('--pointer-angle', `${round(angle)}deg`);
    card.style.setProperty('--pointer-distance', `${round(edge * 100)}`);
    
    card.classList.remove('animating');
  };

  // Function to simulate glow effect based on scroll position
  const simulateGlowFromScroll = (scrollProgress) => {
    const card = divRef.current;
    if (!card) return;

    // Calculate position along the right edge based on scroll progress
    const rect = card.getBoundingClientRect();
    const x = rect.width * 0.9; // 90% to the right (near right edge)
    const y = rect.height * scrollProgress; // Vertical position based on scroll

    // Calculate glow effect parameters
    const [dx, dy] = distanceFromCenter(card, x, y);
    const edge = closenessToEdge(card, x, y);
    const angle = angleFromPointerEvent(card, dx, dy);
    const perx = (x / rect.width) * 100;
    const pery = (y / rect.height) * 100;

    // Apply the glow effect
    card.style.setProperty('--pointer-x', `${round(perx)}%`);
    card.style.setProperty('--pointer-y', `${round(pery)}%`);
    card.style.setProperty('--pointer-angle', `${round(angle)}deg`);
    card.style.setProperty('--pointer-distance', `${round(edge * 100)}`);
    
    // Add animating class to show the glow
    card.classList.add('animating');
  };

  // Detect mobile and set up scroll listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll-based glow effect for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const card = divRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if card is in viewport
      if (rect.bottom < 0 || rect.top > windowHeight) {
        // Card is out of view, remove glow
        card.classList.remove('animating');
        return;
      }

      // Calculate scroll progress (0 to 1) based on card's position in viewport
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Calculate how far the card has scrolled through the viewport
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));

      // Only trigger glow when card is significantly in view
      if (scrollProgress > 0.2 && scrollProgress < 0.8) {
        // Map scroll progress to glow position (0 to 1, top to bottom of card)
        const glowProgress = (scrollProgress - 0.2) / 0.6; // Normalize to 0-1
        simulateGlowFromScroll(glowProgress);
      } else {
        card.classList.remove('animating');
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [isMobile]);

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      <span className="glow-border"></span>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
