"use client";

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Lanyard from "./Lanyard";
import BlurText from "./BlurText";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiFigma } from 'react-icons/si';

// Client-only marquee to avoid hydration issues
const Marquee = dynamic(() => import('react-fast-marquee'), { ssr: false });

export default function LanyardSection() {
  // Set lanyard position once on mount to avoid physics simulation issues
  const [lanyardPosition] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 480) {
      return [-1, 4, 0]; // Move slightly right for small screens
    }
    return [-2, 4, 0]; // Original position for larger screens
  });

  // Stable logo array - memoized to prevent re-renders
  const techLogos = useMemo(() => [
    { icon: <SiReact />, name: "React" },
    { icon: <SiNextdotjs />, name: "Next.js" },
    { icon: <SiTypescript />, name: "TypeScript" },
    { icon: <SiTailwindcss />, name: "Tailwind CSS" },
    { icon: <SiNodedotjs />, name: "Node.js" },
    { icon: <SiFigma />, name: "Figma" }
  ], []);
  return (
    <section className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-visible pt-0 md:pt-16">
      {/* Full-width Lanyard container - spans entire section but hangs on left */}
      <div className="absolute inset-0 z-10 lanyard-container">
        <Lanyard 
          position={[0, 0, 20]} 
          gravity={[0, -40, 0]} 
          lanyardPosition={lanyardPosition}
        />
      </div>
      
      {/* Layout structure for content positioning */}
      <div className="relative z-20 h-full flex pointer-events-none">
        {/* Left side - Empty space where lanyard hangs */}
        <div style={{ width: '42%' }}></div>
        
        {/* Right side - Content */}
        <div style={{ width: '58%' }} className="flex flex-col justify-center pl-16 mobile-center-content">
          {/* Top section - Text and Button */}
          <div className="text-left max-w-lg mb-12 mt-12">
            <BlurText
              text="About Us"
              delay={150}
              animateBy="words"
              direction="top"
              as="h2"
              className="text-white text-4xl font-bold mb-4"
              threshold={0.1}
              rootMargin="0px 0px -10% 0px"
              animationFrom={{ filter: "blur(10px)", opacity: 0, y: -20 }}
              animationTo={[{ filter: "blur(0px)", opacity: 1, y: 0 }]}
              textAlign="left"
              style={{ width: '100%' }}
            />
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Forward Minded Media is a full-service marketing agency, with the belief that marketing should be a true partnership, not just another expense. We help businesses leave the status quo behind by delivering creative, impactful solutions that drive real growth.
            </p>
            
            {/* Button under text */}
            <button className="glass-button-lanyard pointer-events-auto">
              Learn More
            </button>
          </div>
          
          {/* Bottom section - Tech Logos */}
          <div className="w-full max-w-lg overflow-hidden">
            <Marquee 
              gradient={false} 
              speed={60} 
              pauseOnHover={true}
              className="py-4"
            >
              {techLogos.map((logo, index) => (
                <div 
                  key={`${logo.name}-${index}`}
                  className={`flex items-center justify-center text-5xl ${
                    index === techLogos.length - 1 ? 'ml-6 mr-12' : 'mx-6'
                  }`}
                  style={{ color: '#f9ba40' }}
                  title={logo.name}
                >
                  {logo.icon}
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .glass-button-lanyard {
          width: 140px;
          height: 50px;
          font-family: "proxima-nova", sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .glass-button-lanyard::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        
        .glass-button-lanyard:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 8px 25px rgba(255, 255, 255, 0.1),
            0 0 15px rgba(255, 255, 255, 0.05);
        }
        
        .glass-button-lanyard:hover::before {
          left: 100%;
        }
        
        .glass-button-lanyard:active {
          transform: translateY(0) scale(1);
          background: rgba(255, 255, 255, 0.25);
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .mobile-center-content {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding: 2rem !important;
            padding-top: 4rem !important;
            text-align: center !important;
          }
          
          .mobile-center-content .text-left {
            text-align: center !important;
            max-width: 90% !important;
          }
          
          .mobile-center-content h2 {
            text-align: center !important;
          }
          
          .mobile-center-content p {
            text-align: center !important;
            text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.6) !important;
            backdrop-filter: blur(2px) !important;
            background: rgba(30, 41, 59, 0.3) !important;
            padding: 1.5rem !important;
            border-radius: 12px !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          
          .mobile-center-content .max-w-lg {
            max-width: 100% !important;
            width: 100% !important;
            margin-bottom: 14rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-center-content {
            padding: 1.5rem !important;
          }
          
          .mobile-center-content .text-left {
            max-width: 95% !important;
          }
          
          .mobile-center-content h2 {
            font-size: 2.5rem !important;
          }
          
          .mobile-center-content .mb-12 {
            margin-bottom: 14rem !important;
          }
          
          /* Right align the Learn More button on smaller screens */
          .mobile-center-content .glass-button-lanyard {
            margin-left: auto !important;
            margin-right: 0 !important;
            display: block !important;
          }
        }
        
        /* Medium mobile screens - increase spacing */
        @media (min-width: 550px) and (max-width: 740px) {
          .mobile-center-content .max-w-lg {
            margin-bottom: 16rem !important;
          }
        }
        
        /* Mobile lanyard positioning - allow natural hang but prevent scroll */
        @media (max-width: 768px) {
          .lanyard-container {
            transform: translateX(15%) !important;
            width: 120% !important;
            left: -10% !important;
            right: auto !important;
            overflow: visible !important;
            clip-path: none !important;
            mask: none !important;
          }
          
          /* Ensure layout containers don't clip */
          .mobile-center-content {
            overflow: visible !important;
          }
          
          /* Move logo section down on mobile to align with lanyard bottom */
          .mobile-center-content .max-w-lg:last-child {
            margin-top: 4rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .lanyard-container {
            transform: translateX(10%) !important;
            width: 110% !important;
            left: -5% !important;
            right: auto !important;
            overflow: visible !important;
            clip-path: none !important;
            mask: none !important;
          }
          
          /* Adjust logo positioning for smaller screens */
          .mobile-center-content .max-w-lg:last-child {
            margin-top: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
