"use client";

import React, { useRef, useState, useEffect } from "react";
import SprayFillCanvas, { SprayFillHandle } from "./SprayFillCanvas";

export default function SpraySection() {
  const topRef = useRef<SprayFillHandle>(null);
  const bottomRef = useRef<SprayFillHandle>(null);
  const [canvasWidth, setCanvasWidth] = useState(1920);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const initialWidthSet = useRef(false);

  useEffect(() => {
    // Set width ONCE and never change it on mobile
    const checkMobile = window.innerWidth <= 768;
    setIsMobile(checkMobile);
    
    if (!initialWidthSet.current) {
      const viewportWidth = window.innerWidth;
      setCanvasWidth(viewportWidth);
      initialWidthSet.current = true;
    }
    
    // Only allow resize on desktop
    if (!checkMobile) {
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const mobile = window.innerWidth <= 768;
          if (!mobile) {
            setCanvasWidth(window.innerWidth);
          }
        }, 200);
      };
      
      window.addEventListener('resize', handleResize, { passive: true });
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      };
    }
  }, []);

  // Start spray animation when section comes into view
  useEffect(() => {
    if (!sectionRef.current) return;

    // Use lower threshold for mobile devices for earlier trigger
    const threshold = isMobile ? 0.2 : 0.7;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setTimeout(() => {
            topRef.current?.start();
            bottomRef.current?.start();
          }, 200);
          setHasStarted(true);
        }
      },
      { threshold }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStarted, isMobile]);

  // Mobile-optimized settings: Fewer particles for performance
  const flowRate = isMobile ? 25000 : 80000; // ~70% less particles on mobile
  const nozzleRadius = 8;
  const sweepSpeed = 2400; // Same speed on all devices
  const color = "#ffffff";
  const dropletSize = 2.5; // Same size on all devices
  const solidAnimationDuration = '1.0s'; // Same duration on all devices
  const canvasHeight = 240; // Same height on all devices
  const bandHeight = 120; // Same visible band on all devices

  return (
    <div ref={sectionRef} style={{ 
      fontFamily: "system-ui, sans-serif", 
      margin: 0, 
      padding: 0, 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden',
      position: 'relative',
      touchAction: 'pan-y' // Allow vertical scroll only, prevent zoom
    }}>
      {/* Top Spray Band - Only show top half */}
      <div style={{ 
        width: '100%', 
        maxWidth: '100vw',
        height: `${bandHeight}px`, 
        background: '#236292', 
        overflow: 'hidden', 
        position: 'relative' 
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: isMobile ? `${canvasWidth}px` : '100%',
          maxWidth: '100vw',
          overflow: 'hidden'
        }}>
          <SprayFillCanvas
            ref={topRef}
            width={canvasWidth}
            height={canvasHeight}
            color={color}
            background="#236292"
            flowRate={flowRate}
            nozzleRadius={nozzleRadius}
            dropletMean={dropletSize}
            dropletSigma={dropletSize * 0.4}
            dropletMin={dropletSize * 0.4}
            dropletMax={dropletSize * 2.0}
            sweepSpeed={sweepSpeed}
            loop={false}
            clipKind="rect"
            seed={1337}
          />
        </div>
      </div>

      {/* Content Area with Left-to-Right Reveal */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#236292',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        minHeight: '500px',
        padding: isMobile ? '40px 20px' : '80px 40px'
      }}>
        {/* Animated color box */}
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          background: '#ffffff',
          animation: hasStarted ? `revealLTR ${solidAnimationDuration} linear 0.1s forwards` : 'none',
          width: hasStarted ? '0%' : '0%'
        }}>
          <style jsx>{`
            @keyframes revealLTR {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>

        {/* Content */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          maxWidth: '1200px', 
          textAlign: 'center',
          padding: isMobile ? '0 10px' : '0'
        }}>
          <h2 style={{ 
            fontSize: isMobile ? '2.25rem' : '3.5rem', 
            fontWeight: '900', 
            margin: '0 0 24px 0', 
            color: '#236292',
            fontFamily: '"proxima-nova", sans-serif',
            lineHeight: '1.2'
          }}>
            Quality Craftsmanship
          </h2>
          <p style={{ 
            fontSize: isMobile ? '1.125rem' : '1.5rem', 
            color: '#1a4d6b', 
            lineHeight: '1.6', 
            margin: '0 0 40px 0'
          }}>
            Every project starts with precision and ends with perfection. Our professional painting services bring your vision to life with expert application and attention to detail.
          </p>
          
          {/* CTA Button */}
          <button
            style={{
              backgroundColor: 'rgba(35, 98, 146, 0.2)',
              boxShadow: 'inset 0 0 1em 0.5em rgba(35, 98, 146, 0.1)',
              height: '3em',
              width: '10em',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
              fontSize: '16px',
              fontWeight: '700',
              color: '#236292',
              transition: 'all 0.2s ease',
              fontFamily: '"proxima-nova", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.filter = 'drop-shadow(0 3px 3px hsla(0, 0%, 0%, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 1px 1px hsla(0, 0%, 0%, 0.3))';
            }}
          >
            <style jsx>{`
              button::after,
              button::before {
                background-size: 0.4em 0.4em;
                bottom: 0;
                content: '';
                position: absolute;
                top: 0;
                width: 0.2em;
              }
              button::after {
                background-image: linear-gradient(45deg, transparent 50%, hsla(0, 0%, 100%, 0.3) 50%),
                                  linear-gradient(-45deg, transparent 50%, hsla(0, 0%, 100%, 0.3) 50%);
                background-position: 0 100%;
                left: -0.2em;
              }
              button::before {
                background-image: linear-gradient(135deg, transparent 50%, hsla(0, 0%, 100%, 0.3) 50%),
                                  linear-gradient(-135deg, transparent 50%, hsla(0, 0%, 100%, 0.3) 50%);
                background-position: 100% 100%;
                right: -0.2em;
              }
            `}</style>
            Get A Quote
          </button>
        </div>
      </div>

      {/* Bottom Spray Band - Only show bottom half */}
      <div style={{ 
        width: '100%', 
        maxWidth: '100vw',
        height: `${bandHeight}px`, 
        background: '#236292', 
        overflow: 'hidden', 
        position: 'relative' 
      }}>
        <div style={{ 
          position: 'absolute', 
          top: `-${bandHeight}px`, 
          left: 0, 
          width: isMobile ? `${canvasWidth}px` : '100%',
          maxWidth: '100vw',
          overflow: 'hidden'
        }}>
          <SprayFillCanvas
            ref={bottomRef}
            width={canvasWidth}
            height={canvasHeight}
            color={color}
            background="#236292"
            flowRate={flowRate}
            nozzleRadius={nozzleRadius}
            dropletMean={dropletSize}
            dropletSigma={dropletSize * 0.4}
            dropletMin={dropletSize * 0.4}
            dropletMax={dropletSize * 2.0}
            sweepSpeed={sweepSpeed}
            loop={false}
            clipKind="rect"
            seed={2468}
          />
        </div>
      </div>
    </div>
  );
}

