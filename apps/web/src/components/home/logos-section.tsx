"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Building2,
  Cpu,
  Database,
  Globe,
  Layers,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";

const logos = [
  { name: "Acme Corp", icon: Building2 },
  { name: "TechFlow", icon: Zap },
  { name: "CloudBase", icon: Database },
  { name: "DataSync", icon: Layers },
  { name: "Nextera", icon: Globe },
  { name: "Orbis", icon: Shield },
  { name: "Streamline", icon: Rocket },
  { name: "Vertex", icon: Cpu },
];

function LogoItem({
  name,
  icon: Icon,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex-shrink-0 flex items-center gap-2.5 px-6 group cursor-default">
      <Icon className="h-5 w-5 text-white/15 group-hover:text-white/40 transition-colors duration-300" />
      <span className="text-base font-semibold text-white/15 group-hover:text-white/40 whitespace-nowrap select-none transition-colors duration-300">
        {name}
      </span>
    </div>
  );
}

export function LogosSection() {
  const allLogos = [...logos, ...logos, ...logos];

  return (
    <section className="relative py-16 overflow-hidden border-y border-white/[0.04]">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-xs font-semibold text-white/20 mb-8 uppercase tracking-[0.2em]"
      >
        Trusted by teams at
      </motion.p>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a12] to-transparent z-10 pointer-events-none" />

        {/* Scrolling logos */}
        <div className="flex gap-0 animate-marquee">
          {allLogos.map((logo, i) => (
            <LogoItem key={`${logo.name}-${i}`} {...logo} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
