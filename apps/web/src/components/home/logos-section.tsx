"use client";

import React from "react";
import { motion } from "motion/react";

const logos = [
  "Acme Corp",
  "TechFlow",
  "CloudBase",
  "DataSync",
  "Nextera",
  "Orbis",
  "Streamline",
  "Vertex",
];

export function LogosSection() {
  return (
    <section className="py-16 border-y border-border/40 bg-muted/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest"
        >
          Trusted by teams at
        </motion.p>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/20 to-transparent z-10 pointer-events-none" />
          {/* Scrolling logos */}
          <div className="flex gap-12 animate-[marquee_30s_linear_infinite]">
            {[...logos, ...logos].map((name, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center h-10 px-6"
              >
                <span className="text-lg font-semibold text-muted-foreground/40 whitespace-nowrap select-none">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
