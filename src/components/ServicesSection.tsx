"use client";

import SpotlightCard from "./SpotlightCard";
import ServiceIcon from "./ServiceIcon";
import BlurText from "./BlurText";

export default function ServicesSection() {
  const services = [
    {
      title: "Residential",
      description: "Transform your home with our expert residential painting services. From single rooms to entire houses, we deliver beautiful, lasting finishes that enhance your living space and protect your investment.",
      spotlightColor: "rgba(184, 234, 104, 0.25)", // Green
      icon: "residential" as const,
      iconColor: "#b8ea68"
    },
    {
      title: "Commercial",
      description: "Professional painting solutions for businesses of all sizes. We work efficiently to minimize disruption while delivering high-quality results that reflect your brand and create welcoming spaces for customers and employees.",
      spotlightColor: "rgba(184, 234, 104, 0.25)", // Green
      icon: "commercial" as const,
      iconColor: "#b8ea68"
    },
    {
      title: "Interior",
      description: "Bring new life to your interior spaces with our meticulous interior painting services. We use premium paints and proven techniques to create flawless finishes that stand the test of time.",
      spotlightColor: "rgba(184, 234, 104, 0.25)", // Green
      icon: "interior" as const,
      iconColor: "#b8ea68"
    },
    {
      title: "Exterior",
      description: "Protect and beautify your property's exterior with our durable painting solutions. We handle all surfaces and weather conditions to ensure a stunning, long-lasting finish that boosts curb appeal.",
      spotlightColor: "rgba(184, 234, 104, 0.25)", // Green
      icon: "exterior" as const,
      iconColor: "#b8ea68"
    },
    {
      title: "Decks",
      description: "Restore and protect your deck with our specialized deck staining and sealing services. We prepare surfaces properly and use quality products to ensure your deck looks great and withstands the elements.",
      spotlightColor: "rgba(184, 234, 104, 0.25)", // Green
      icon: "decks" as const,
      iconColor: "#b8ea68"
    },
    {
      title: "Power Washing",
      description: "Prepare surfaces for painting or simply refresh your property's appearance with our professional power washing services. We safely remove dirt, mildew, and grime to reveal clean, like-new surfaces.",
      spotlightColor: "rgba(184, 234, 104, 0.25)", // Green
      icon: "powerwashing" as const,
      iconColor: "#b8ea68"
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#236292' }}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BlurText
            text="Our Services"
            delay={150}
            animateBy="words"
            direction="top"
            as="h2"
            className="text-5xl font-bold text-white mb-6 text-center w-full"
            threshold={0.1}
            rootMargin="0px 0px -10% 0px"
            animationFrom={{ filter: "blur(10px)", opacity: 0, y: -20 }}
            animationTo={[{ filter: "blur(0px)", opacity: 1, y: 0 }]}
            onAnimationComplete={() => {}}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Professional painting and coating services designed to protect and beautify your property.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <SpotlightCard 
              key={index}
              className="h-full"
              spotlightColor={service.spotlightColor}
            >
              <div className="h-full flex flex-col">
                {/* Service Icon */}
                <div className="mb-6 flex justify-center">
                  <ServiceIcon 
                    type={service.icon}
                    size={72}
                    color={service.iconColor}
                    className="service-icon"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 text-center service-card-title">
                  {service.title}
                </h3>
                <p className="text-gray-300 leading-relaxed flex-grow text-center">
                  {service.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
