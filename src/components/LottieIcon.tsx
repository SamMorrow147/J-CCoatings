"use client";

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LottieIconProps {
  animationData?: object;
  animationPath?: string;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onHover?: boolean;
}

const LottieIcon: React.FC<LottieIconProps> = ({
  animationData,
  animationPath,
  width = 80,
  height = 80,
  loop = true,
  autoplay = false,
  className = '',
  onHover = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load animation
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData: animationData,
      path: animationPath,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        className: 'lottie-svg'
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, animationPath, loop, autoplay]);

  const handleMouseEnter = () => {
    if (onHover && animationRef.current) {
      animationRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (onHover && animationRef.current) {
      animationRef.current.stop();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`lottie-icon ${className}`}
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default LottieIcon;

