"use client";

import { useRef, useEffect } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
  const divRef = useRef(null);

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
