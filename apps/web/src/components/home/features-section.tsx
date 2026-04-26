"use client";

import React from "react";
import { motion } from "motion/react";
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
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Activity,
    title: "Real-Time Dashboard",
    description:
      "WebSocket-powered live updates. New tickets and replies appear instantly — no refresh needed.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Brain,
    title: "AI Auto-Tagging",
    description:
      "AI classifies incoming tickets with category, sentiment, and priority tags automatically.",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: Route,
    title: "Smart Assignment",
    description:
      "Rule-based routing with drag-and-drop priority. Supports specific agent or round-robin strategies.",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-500",
  },
  {
    icon: Building2,
    title: "Multi-Tenant Workspaces",
    description:
      "Isolated workspaces per organization with subdomain-based routing and role-based access.",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "text-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Team Collaboration",
    description:
      "Public replies, internal notes, and full conversation history. Your team stays in sync.",
    gradient: "from-teal-500/10 to-cyan-500/10",
    iconColor: "text-teal-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
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
            Everything your support team needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From email ingestion to AI-powered routing — SupportHub handles the
            entire ticket lifecycle.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative rounded-xl border border-border/60 bg-background p-6 hover:border-border hover:shadow-lg transition-all duration-300"
            >
              {/* Gradient bg on hover */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative">
                <div
                  className={`inline-flex items-center justify-center h-11 w-11 rounded-lg bg-muted/60 mb-4 ${feature.iconColor}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
