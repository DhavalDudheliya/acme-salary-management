"use client";

import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "SupportHub cut our average response time by 60%. The AI tagging alone saves us hours of manual triage every day.",
    name: "Sarah Chen",
    role: "Head of Support",
    company: "TechFlow",
    initials: "SC",
  },
  {
    quote:
      "We switched from Zendesk and haven't looked back. The email integration just works — and the real-time dashboard keeps our team focused.",
    name: "Marcus Rivera",
    role: "VP of Customer Success",
    company: "CloudBase",
    initials: "MR",
  },
  {
    quote:
      "Setting up assignment rules took 5 minutes. Now tickets get routed to the right agent automatically. It's been a game changer.",
    name: "Priya Patel",
    role: "Support Operations Lead",
    company: "DataSync",
    initials: "PP",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Loved by support teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See why teams are switching to SupportHub for their customer support
            operations.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex flex-col rounded-xl border border-border/60 bg-background p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-foreground/80 leading-relaxed flex-1 mb-6">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
