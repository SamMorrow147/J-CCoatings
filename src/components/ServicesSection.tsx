"use client";

import SpotlightCard from "./SpotlightCard";
import ServiceIcon from "./ServiceIcon";
import BlurText from "./BlurText";

export default function ServicesSection() {
  const services = [
    {
      title: "In House Digital Advertising",
      description: "Our in-house digital display ad production ensures swift turnaround times, allowing you to respond to market changes and campaign needs with agility. With a dedicated team at your fingertips, you can seamlessly create and launch high-quality ads in record time.",
      spotlightColor: "rgba(59, 130, 246, 0.2)", // Blue
      icon: "advertising" as const,
      iconColor: "#3B82F6"
    },
    {
      title: "Graphic Design",
      description: "Our in-house graphic designers bring your vision to life with unmatched creativity and efficiency, ensuring that your projects are tailored to your brand's unique identity. With close collaboration and quick feedback loops, we can deliver stunning visuals that meet your deadlines without compromising on quality.",
      spotlightColor: "rgba(168, 85, 247, 0.2)", // Purple
      icon: "design" as const,
      iconColor: "#A855F7"
    },
    {
      title: "Apparel",
      description: "With access to an amazing selection of customized apparel, you can elevate your brand's visibility and create a lasting impression. Whether for events, promotions, or team uniforms, our diverse options ensure that your unique style and message shine through.",
      spotlightColor: "rgba(34, 197, 94, 0.2)", // Green
      icon: "apparel" as const,
      iconColor: "#22C55E"
    },
    {
      title: "Promotional Items",
      description: "Promotional items are a powerful way to enhance brand recognition and create lasting connections with your audience. With a wide range of customizable options available, you can choose unique products that resonate with your target market. From practical giveaways to fun merchandise, these promotional items help to effectively communicate your brand message while leaving a memorable impression.",
      spotlightColor: "rgba(249, 115, 22, 0.2)", // Orange
      icon: "promotional" as const,
      iconColor: "#F97316"
    },
    {
      title: "Media Purchasing",
      description: "With our extensive media purchasing connections, we handle all the negotiations and logistics, ensuring you get the best placements at competitive rates. Let us do the talking for you, so you can focus on your core business while we maximize your advertising impact.",
      spotlightColor: "rgba(236, 72, 153, 0.2)", // Pink
      icon: "media" as const,
      iconColor: "#EC4899"
    },
    {
      title: "Podcast Production",
      description: "Our podcast production services streamline the entire process, from concept development to final editing, ensuring your voice reaches the right audience. With a focus on quality and engaging content, we help you create compelling podcasts that resonate and build a loyal following.",
      spotlightColor: "rgba(14, 165, 233, 0.2)", // Cyan
      icon: "podcast" as const,
      iconColor: "#0EA5E9"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
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
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive marketing solutions designed to elevate your brand and drive meaningful results.
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
                
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
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
