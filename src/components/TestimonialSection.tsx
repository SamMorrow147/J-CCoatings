"use client";

import { useRef, useState } from 'react';
import SpotlightCard from "./SpotlightCard";
import BlurText from "./BlurText";

export default function TestimonialSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechStart Inc.",
      role: "CEO & Founder",
      testimonial: "Forward Minded Media transformed our digital presence completely. Their strategic approach and creative execution helped us increase our online engagement by 300% in just six months. The team's dedication and expertise are unmatched.",
      spotlightColor: "rgba(59, 130, 246, 0.2)", // Blue
    },
    {
      name: "Michael Chen",
      company: "GrowthCorp",
      role: "Marketing Director",
      testimonial: "Working with Forward Minded Media has been a game-changer for our business. Their innovative campaigns and data-driven strategies delivered results beyond our expectations. We saw a 250% ROI within the first quarter.",
      spotlightColor: "rgba(168, 85, 247, 0.2)", // Purple
    },
    {
      name: "Emily Rodriguez",
      company: "Innovate Solutions",
      role: "Brand Manager",
      testimonial: "The creative team at Forward Minded Media brought our vision to life in ways we never imagined. Their attention to detail and ability to understand our brand essence resulted in campaigns that truly resonated with our audience.",
      spotlightColor: "rgba(34, 197, 94, 0.2)", // Green
    },
    {
      name: "David Thompson",
      company: "NextGen Retail",
      role: "VP of Marketing",
      testimonial: "Forward Minded Media's comprehensive approach to marketing strategy helped us navigate a challenging market transition. Their expertise in both traditional and digital channels was exactly what we needed to stay competitive.",
      spotlightColor: "rgba(249, 115, 22, 0.2)", // Orange
    },
    {
      name: "Lisa Park",
      company: "Creative Dynamics",
      role: "Creative Director",
      testimonial: "The collaboration with Forward Minded Media elevated our brand to new heights. Their team's creativity, professionalism, and strategic thinking made them an invaluable partner in our growth journey.",
      spotlightColor: "rgba(236, 72, 153, 0.2)", // Pink
    },
    {
      name: "Robert Kim",
      company: "Digital Ventures",
      role: "Founder",
      testimonial: "Forward Minded Media doesn't just deliver campaigns; they deliver results. Their data-driven approach and creative excellence helped us achieve our most successful product launch to date. Highly recommended!",
      spotlightColor: "rgba(14, 165, 233, 0.2)", // Cyan
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BlurText
            text="What Our Clients Say"
            delay={100}
            animateBy="words"
            direction="top"
            as="h2"
            className="text-5xl font-bold text-white mb-6 text-center w-full blur-text-title"
            threshold={0.3}
            animationFrom={{ filter: "blur(10px)", opacity: 0 }}
            animationTo={{ filter: "blur(0px)", opacity: 1 }}
            onAnimationComplete={() => console.log('Title animation completed!')}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say about their experience working with Forward Minded Media.
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
            <p className="text-gray-500 text-sm flex items-center gap-2">
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
          background: linear-gradient(to right, rgb(17, 24, 39), transparent);
        }
        
        .relative::after {
          right: 0;
          background: linear-gradient(to left, rgb(17, 24, 39), transparent);
        }
      `}</style>
    </section>
  );
}
