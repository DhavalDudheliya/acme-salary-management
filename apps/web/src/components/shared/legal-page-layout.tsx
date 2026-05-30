"use client";

import React, { useEffect, useState } from "react";
import { MarketingNavbar } from "@/components/home/marketing-navbar";
import { MarketingFooter } from "@/components/home/marketing-footer";
import { cn } from "@supporthub/ui/lib/utils";
import { ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  sections: Section[];
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Force dark mode for legal pages
    document.documentElement.classList.add("dark");

    const observer = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        const firstIntersecting = intersecting[0];
        if (firstIntersecting) {
          // Set active section to the first one intersecting
          setActiveSection(firstIntersecting.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the middle of the viewport
        threshold: 0.1,
      },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Account for fixed header
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-sans scroll-smooth overflow-x-hidden selection:bg-primary/35 selection:text-primary-foreground">
      <MarketingNavbar />

      <main className="relative pt-32 pb-24">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-white/[0.06] pb-10 mb-12 relative">
            <p className="text-sm font-semibold tracking-wider text-blue-400 uppercase mb-3">
              Legal Documents
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-white/60 max-w-3xl leading-relaxed mb-4">
                {subtitle}
              </p>
            )}
            <p className="text-xs text-white/40">Last updated: {lastUpdated}</p>
          </div>

          {/* Page Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sidebar TOC */}
            <aside className="lg:col-span-4 sticky top-28 hidden lg:block">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/45 mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "w-full text-left flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all group duration-200 border-l-2",
                          isActive
                            ? "bg-white/[0.05] text-white border-blue-500 pl-4"
                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.02] border-transparent",
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isActive
                              ? "text-blue-400 translate-x-0"
                              : "text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-1",
                          )}
                        />
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content Body */}
            <article className="lg:col-span-8 space-y-12">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 border-b border-white/[0.04] pb-10 last:border-0 last:pb-0"
                >
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
                    {section.title}
                  </h2>
                  <div className="text-white/60 leading-relaxed text-[15px] space-y-4">
                    {section.content}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
