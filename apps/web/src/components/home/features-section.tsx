"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  Mail,
  Activity,
  Brain,
  Route,
  Building2,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Email-to-Ticket",
    description:
      "Connect Gmail or Outlook in one click. Inbound emails are automatically converted into actionable support tickets.",
    colorClass:
      "text-blue-400 border-blue-500/15 bg-blue-500/[0.03] group-hover:bg-blue-500/[0.08] group-hover:border-blue-500/30",
    glowColor: "rgba(59, 130, 246, 0.12)",
    span: "sm:col-span-2 lg:col-span-4 lg:row-span-1",
  },
  {
    icon: Brain,
    title: "AI Auto-Tagging",
    description:
      "AI classifies incoming tickets with category, sentiment, and priority tags automatically.",
    colorClass:
      "text-violet-400 border-violet-500/15 bg-violet-500/[0.03] group-hover:bg-violet-500/[0.08] group-hover:border-violet-500/30",
    glowColor: "rgba(139, 92, 246, 0.12)",
    span: "sm:col-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2",
  },
  {
    icon: Activity,
    title: "Real-Time Dashboard",
    description:
      "WebSocket-powered live updates. New tickets and replies appear instantly — no refresh needed.",
    colorClass:
      "text-emerald-400 border-emerald-500/15 bg-emerald-500/[0.03] group-hover:bg-emerald-500/[0.08] group-hover:border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.12)",
    span: "sm:col-span-1 lg:col-span-2 lg:row-span-1",
  },
  {
    icon: Route,
    title: "Smart Assignment",
    description:
      "Rule-based routing with drag-and-drop priority. Supports specific agent or round-robin strategies.",
    colorClass:
      "text-amber-400 border-amber-500/15 bg-amber-500/[0.03] group-hover:bg-amber-500/[0.08] group-hover:border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.12)",
    span: "sm:col-span-1 lg:col-span-2 lg:row-span-1",
  },
  {
    icon: Building2,
    title: "Multi-Tenant Workspaces",
    description:
      "Isolated workspaces per organization with subdomain-based routing and role-based access.",
    colorClass:
      "text-pink-400 border-pink-500/15 bg-pink-500/[0.03] group-hover:bg-pink-500/[0.08] group-hover:border-pink-500/30",
    glowColor: "rgba(236, 72, 153, 0.12)",
    span: "sm:col-span-1 lg:col-span-3 lg:row-span-1",
  },
  {
    icon: MessageSquare,
    title: "Team Collaboration",
    description:
      "Public replies, internal notes, and full conversation history. Your team stays in sync.",
    colorClass:
      "text-cyan-400 border-cyan-500/15 bg-cyan-500/[0.03] group-hover:bg-cyan-500/[0.08] group-hover:border-cyan-500/30",
    glowColor: "rgba(6, 182, 212, 0.12)",
    span: "sm:col-span-1 lg:col-span-3 lg:row-span-1",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    damping: 20,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    damping: 20,
    stiffness: 150,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 hover:border-white/[0.12] transition-colors duration-500 ${feature.span}`}
    >
      {/* Spotlight gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.glowColor}, transparent 40%)`,
        }}
      />

      {/* Gradient border glow on hover */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${feature.glowColor}, transparent)`,
        }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center h-12 w-12 rounded-xl border ${feature.colorClass} mb-5 shadow-lg transition-all duration-300`}
          style={{
            boxShadow: `0 8px 24px ${feature.glowColor}`,
          }}
        >
          <feature.icon className="h-5 w-5" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/40 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-blue-400 tracking-wide uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Everything your support team needs
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            From email ingestion to AI-powered routing — SupportHub handles the
            entire ticket lifecycle.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4"
          style={{ perspective: "1000px" }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
