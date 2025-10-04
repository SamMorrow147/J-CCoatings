"use client";

import LogoLoop from "./LogoLoop";
import BlurText from "./BlurText";

export default function LogoSection() {
  // Sample partner/client logos for painting company
  const logos = [
    { src: "/logo.svg", alt: "Partner 1", width: 120, height: 40 },
    { src: "/logo.svg", alt: "Partner 2", width: 120, height: 40 },
    { src: "/logo.svg", alt: "Partner 3", width: 120, height: 40 },
    { src: "/logo.svg", alt: "Partner 4", width: 120, height: 40 },
    { src: "/logo.svg", alt: "Partner 5", width: 120, height: 40 },
    { src: "/logo.svg", alt: "Partner 6", width: 120, height: 40 },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BlurText
            text="Trusted By Industry Leaders"
            delay={150}
            animateBy="words"
            direction="top"
            as="h2"
            className="text-5xl font-bold text-gray-900 mb-6 text-center w-full"
            threshold={0.1}
            rootMargin="0px 0px -10% 0px"
            animationFrom={{ filter: "blur(10px)", opacity: 0, y: -20 }}
            animationTo={[{ filter: "blur(0px)", opacity: 1, y: 0 }]}
          />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Partnering with top contractors, builders, and property managers to deliver exceptional results.
          </p>
        </div>

        {/* Logo Loop */}
        <div className="mt-12">
          <LogoLoop
            logos={logos}
            speed={60}
            direction="left"
            logoHeight={40}
            gap={60}
            pauseOnHover={true}
            scaleOnHover={true}
            ariaLabel="Our trusted partners"
          />
        </div>
      </div>
    </section>
  );
}
