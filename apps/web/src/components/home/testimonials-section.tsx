"use client";

import React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "SupportHub cut our average response time by 60%. The AI tagging alone saves us hours of manual triage every day.",
    name: "Sarah Chen",
    role: "Head of Support",
    company: "TechFlow",
    avatar: "https://i.pravatar.cc/80?img=1",
  },
  {
    quote:
      "We switched from Zendesk and haven't looked back. The email integration just works — and the real-time dashboard keeps our team focused.",
    name: "Marcus Rivera",
    role: "VP of Customer Success",
    company: "CloudBase",
    avatar: "https://i.pravatar.cc/80?img=3",
  },
  {
    quote:
      "Setting up assignment rules took 5 minutes. Now tickets get routed to the right agent automatically. It's been a game changer.",
    name: "Priya Patel",
    role: "Support Operations Lead",
    company: "DataSync",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    quote:
      "The multi-tenant workspace feature is incredible. We manage support for 12 brands from a single dashboard without any overlap.",
    name: "David Kim",
    role: "CTO",
    company: "Nextera",
    avatar: "https://i.pravatar.cc/80?img=8",
  },
  {
    quote:
      "Best support tool we've ever used. The real-time WebSocket updates mean we never miss a ticket. Our CSAT went from 78% to 96%.",
    name: "Emily Foster",
    role: "Customer Experience Director",
    company: "Streamline",
    avatar: "https://i.pravatar.cc/80?img=9",
  },
  {
    quote:
      "The AI confidence scores give us full transparency into how tickets are classified. Our team trusts the system completely.",
    name: "Alex Nakamura",
    role: "Head of Engineering",
    company: "Orbis",
    avatar: "https://i.pravatar.cc/80?img=11",
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <div className="flex-shrink-0 w-[340px] sm:w-[380px] mx-3 group">
      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-500 h-full">
        {/* Quote icon */}
        <Quote className="h-6 w-6 text-white/[0.04] mb-4" />

        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star
              key={j}
              className="h-3.5 w-3.5 fill-amber-400/70 text-amber-400/70"
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-sm text-white/45 leading-relaxed mb-6">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/[0.06]"
          />
          <div>
            <p className="text-sm font-semibold text-white/70">
              {testimonial.name}
            </p>
            <p className="text-[10px] text-white/25">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const row1 = [
    ...testimonials.slice(0, 3),
    ...testimonials.slice(0, 3),
    ...testimonials.slice(0, 3),
  ];
  const row2 = [
    ...testimonials.slice(3, 6),
    ...testimonials.slice(3, 6),
    ...testimonials.slice(3, 6),
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-amber-400 tracking-wide uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Loved by support teams
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            See why teams are switching to SupportHub for their customer support
            operations.
          </p>
        </motion.div>
      </div>

      {/* Dual-row marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-[#0a0a12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-l from-[#0a0a12] to-transparent z-10 pointer-events-none" />

        {/* Row 1 — scrolls left */}
        <div className="flex mb-4 animate-marquee-left">
          {row1.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} testimonial={t} />
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div className="flex animate-marquee-right">
          {row2.map((t, i) => (
            <TestimonialCard key={`r2-${i}`} testimonial={t} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(-33.333%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 45s linear infinite;
          will-change: transform;
        }
        .animate-marquee-right {
          animation: marquee-right 50s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
