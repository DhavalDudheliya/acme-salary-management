"use client";

import { MarketingNavbar } from "./marketing-navbar";
import { HeroSection } from "./hero-section";
import { LogosSection } from "./logos-section";
import { FeaturesSection } from "./features-section";
import { ProductShowcaseSection } from "./product-showcase-section";
import { HowItWorksSection } from "./how-it-works-section";
import { AISection } from "./ai-section";
import { PricingSection } from "./pricing-section";
import { TestimonialsSection } from "./testimonials-section";
import { CTASection } from "./cta-section";
import { MarketingFooter } from "./marketing-footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans scroll-smooth">
      <MarketingNavbar />
      <main>
        <HeroSection />
        <LogosSection />
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
