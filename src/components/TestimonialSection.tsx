"use client";

import { useRef, useState, useEffect } from 'react';
import SpotlightCard from "./SpotlightCard";
import BlurText from "./BlurText";
import SprayFillCanvas, { SprayFillHandle } from "./SprayFillCanvas";

export default function TestimonialSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Spray effect state
  const topRef = useRef<SprayFillHandle>(null);
  const bottomRef = useRef<SprayFillHandle>(null);
  const [canvasWidth, setCanvasWidth] = useState(1920);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Spray effect setup
  useEffect(() => {
    setCanvasWidth(window.innerWidth);
    
    const handleResize = () => {
      setCanvasWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Use lower threshold for mobile devices
    const isMobile = window.innerWidth <= 768;
    const threshold = isMobile ? 0.1 : 0.7; // 10% on mobile, 70% on desktop
    
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
  }, [hasStarted]);

  // Adjust settings for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const flowRate = isMobile ? 60000 : 80000; // Reduce flow rate on mobile for performance
  const nozzleRadius = 8;
  const sweepSpeed = isMobile ? 1200 : 2400; // Half speed on mobile (narrower screen)
  const sprayColor = "#ffffff";
  const dropletSize = 2.5;
  const solidAnimationDuration = isMobile ? '0.6s' : '1.0s'; // Much faster on mobile
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Residential Property",
      role: "Homeowner",
      testimonial: "J&C Coatings transformed our home completely. Their attention to detail and professional approach helped us achieve the perfect finish we were looking for. The team's dedication and expertise are unmatched.",
      spotlightColor: "rgba(59, 130, 246, 0.2)", // Blue
    },
    {
      name: "Michael Chen",
      company: "Chen Properties LLC",
      role: "Property Manager",
      testimonial: "Working with J&C Coatings has been a game-changer for our properties. Their quality workmanship and reliable service delivered results beyond our expectations. Every project was completed on time and within budget.",
      spotlightColor: "rgba(168, 85, 247, 0.2)", // Purple
    },
    {
      name: "Emily Rodriguez",
      company: "Downtown Office Complex",
      role: "Facilities Manager",
      testimonial: "The professional team at J&C Coatings brought our vision to life in ways we never imagined. Their attention to detail and ability to work around our business hours resulted in a beautiful finish that impressed everyone.",
      spotlightColor: "rgba(34, 197, 94, 0.2)", // Green
    },
    {
      name: "David Thompson",
      company: "Thompson Retail Spaces",
      role: "Business Owner",
      testimonial: "J&C Coatings' comprehensive approach to painting helped us refresh our retail locations perfectly. Their expertise in both interior and exterior work was exactly what we needed to maintain our properties.",
      spotlightColor: "rgba(249, 115, 22, 0.2)", // Orange
    },
    {
      name: "Lisa Park",
      company: "Park Realty Group",
      role: "Real Estate Developer",
      testimonial: "The collaboration with J&C Coatings elevated our properties to new heights. Their team's professionalism, quality work, and reliability made them an invaluable partner in preparing homes for sale.",
      spotlightColor: "rgba(236, 72, 153, 0.2)", // Pink
    },
    {
      name: "Robert Kim",
      company: "Kim Construction",
      role: "General Contractor",
      testimonial: "J&C Coatings doesn't just deliver painting services; they deliver outstanding results. Their professional approach and quality finishes helped us complete our most successful project to date. Highly recommended!",
      spotlightColor: "rgba(14, 165, 233, 0.2)", // Cyan
    }
  ];

  return (
    <div ref={sectionRef} style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Top Spray Band */}
      <div style={{ width: '100%', height: '120px', background: '#236292', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          <SprayFillCanvas
            ref={topRef}
            width={canvasWidth}
            height={240}
            color={sprayColor}
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
            seed={3333}
          />
        </div>
      </div>

      {/* Testimonials Content with animated white reveal */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#236292',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'auto'
      }}>
        {/* Animated white background box */}
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
        <section className="py-12" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BlurText
            text="What Our Clients Say"
            delay={150}
            animateBy="words"
            direction="top"
            as="h2"
            className="text-5xl font-bold text-gray-900 mb-6 text-center w-full blur-text-title"
            threshold={0.1}
            rootMargin="0px 0px -10% 0px"
            animationFrom={{ filter: "blur(10px)", opacity: 0, y: -20 }}
            animationTo={[{ filter: "blur(0px)", opacity: 1, y: 0 }]}
            onAnimationComplete={() => console.log('Title animation completed!')}
          />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say about their experience working with J&C Coatings.
          </p>
        </div>

        {/* Horizontal Scrollable Testimonials */}
        <div className="relative overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className={`flex gap-6 overflow-x-scroll pb-6 scrollbar-hide snap-x snap-mandatory px-6 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ width: 'max-content', minWidth: '100%' }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-none w-80 snap-start">
                <SpotlightCard 
                  className="h-full"
                  spotlightColor={testimonial.spotlightColor}
                >
                  <div className="h-full flex flex-col">
                    {/* Quote Icon */}
                    <div className="mb-6 flex justify-center">
                      <svg 
                        className="w-12 h-12 text-gray-400" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    
                    {/* Testimonial Text */}
                    <blockquote className="text-gray-300 text-lg leading-relaxed mb-8 flex-grow italic">
                      &ldquo;{testimonial.testimonial}&rdquo;
                    </blockquote>
                    
                    {/* Client Info */}
                    <div className="text-center">
                      <h4 className="text-white text-xl font-bold mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-400 text-sm mb-1">
                        {testimonial.role}
                      </p>
                      <p className="text-gray-500 text-sm font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
          
          {/* Scroll Indicator */}
          <div className="flex justify-center mt-8">
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Scroll to see more testimonials
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
        
        /* Smooth scrolling */
        .overflow-x-scroll {
          scroll-behavior: smooth;
        }
        
        /* Force correct font for BlurText title */
        .blur-text-title,
        .blur-text-title * {
          font-family: "proxima-nova", sans-serif !important;
          font-weight: 800 !important;
          font-style: normal !important;
        }
        
        /* Fade effect on edges */
        .relative::before,
        .relative::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 24px; /* Account for padding-bottom */
          width: 40px;
          pointer-events: none;
          z-index: 10;
        }
        
        .relative::before {
          left: 0;
          background: linear-gradient(to right, #ffffff, transparent);
        }
        
        .relative::after {
          right: 0;
          background: linear-gradient(to left, #ffffff, transparent);
        }
        
        /* Mobile adjustments - hide left gradient and reduce right gradient */
        @media (max-width: 768px) {
          .relative::before {
            display: none; /* Hide left gradient on mobile */
          }
          
          .relative::after {
            width: 20px; /* Smaller right gradient on mobile */
          }
        }
      `}</style>
    </section>
    </div>

    {/* Bottom Spray Band */}
    <div style={{ width: '100%', height: '120px', background: '#236292', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-120px', left: 0, width: '100%' }}>
        <SprayFillCanvas
          ref={bottomRef}
          width={canvasWidth}
          height={240}
          color={sprayColor}
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
          seed={4444}
        />
      </div>
    </div>
  </div>
  );
}
