"use client";

import Header from "@/components/Header";
import SpraySection from "@/components/SpraySection";
import LanyardSection from "@/components/LanyardSection";
import TrueFocusSection from "@/components/TrueFocusSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialSection from "@/components/TestimonialSection";
import LogoSection from "@/components/LogoSection";
import Footer from "@/components/Footer";
import GradualBlur from "@/components/GradualBlur";
import StaggeredMenu from "@/components/StaggeredMenu";
import AdobeFonts from "@/components/AdobeFonts";

export default function Home() {
  // Menu items configuration
  const menuItems: Array<{ label: string; ariaLabel: string; link: string }> = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Portfolio', ariaLabel: 'View our work', link: '/portfolio' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems: Array<{ label: string; link: string }> = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'Instagram', link: 'https://instagram.com' }
  ];

  return (
    <div>
      {/* Adobe Fonts Loader */}
      <AdobeFonts />
      
      {/* Staggered Menu - fixed positioned overlay */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        menuButtonColor="#fff"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        colors={['#b8ea68', '#66b6ff', '#236292']}
        logoUrl="/jc-coatings-logo.png"
        accentColor="#b8ea68"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
      
      <Header />
      <SpraySection />
      {/* <LanyardSection /> */}
      {/* <TrueFocusSection /> */}
      <ServicesSection />
      <TestimonialSection />
      {/* <LogoSection /> */}
      <Footer />
      
      {/* Global page-level blur effect at the bottom of the screen */}
      <GradualBlur
        target="page"
        position="bottom"
        height="8rem"
        strength={3}
        divCount={6}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </div>
  );
}
