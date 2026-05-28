"use client";

import { useEffect } from "react";
import { MarketingNavbar } from "./marketing-navbar";
import { HeroSection } from "./hero-section";
import { LogosSection } from "./logos-section";
import { StatsSection } from "./stats-section";
import { FeaturesSection } from "./features-section";
import { ProductShowcaseSection } from "./product-showcase-section";
import { HowItWorksSection } from "./how-it-works-section";
import { AISection } from "./ai-section";
import { PricingSection } from "./pricing-section";
import { TestimonialsSection } from "./testimonials-section";
import { CTASection } from "./cta-section";
import { MarketingFooter } from "./marketing-footer";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HomePage() {
  useEffect(() => {
    // Force dark theme for the marketing page specifically
    document.documentElement.classList.add("dark");

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    return () => {
      // Revert theme if navigating away from marketing page (depends on your app's routing)
      // document.documentElement.classList.remove("dark");
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-sans scroll-smooth overflow-x-hidden selection:bg-primary/35 selection:text-primary-foreground">
      <MarketingNavbar />
      <main>
        <HeroSection />
        <LogosSection />
        <StatsSection />
        <FeaturesSection />
        <ProductShowcaseSection />
        <HowItWorksSection />
        <AISection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
