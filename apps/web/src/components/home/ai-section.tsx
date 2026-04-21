"use client";

import React from "react";
import { motion } from "motion/react";
import { Brain, Tag, ArrowRight, Shield } from "lucide-react";

const tags = [
  {
    label: "billing",
    color: "bg-blue-500/15 text-blue-600 border-blue-500/25",
  },
  {
    label: "refund",
    color: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  },
  {
    label: "high-priority",
    color: "bg-red-500/15 text-red-600 border-red-500/25",
  },
  {
    label: "negative sentiment",
    color: "bg-pink-500/15 text-pink-600 border-pink-500/25",
  },
];

export function AISection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-xl border border-border/60 bg-background p-6 shadow-lg">
              {/* Simulated ticket card */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">
                      jane.doe@example.com
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">
                    2m ago
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-1">
                  Billing Issue — Order #12345
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  I was charged twice for my last order. I see two identical
                  pending transactions on my bank statement...
                </p>
              </div>

              {/* AI processing indicator */}
              <div className="flex items-center gap-2 mb-4 text-xs text-violet-500 font-medium">
                <Brain className="h-3.5 w-3.5 animate-pulse" />
                AI analyzed this ticket
              </div>

              {/* Animated tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <motion.span
                    key={tag.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.12 }}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${tag.color}`}
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </div>

              {/* Assignment arrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="mt-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-600"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                Auto-assigned to Billing Team
              </motion.div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/8 to-blue-500/8 rounded-2xl blur-2xl -z-10" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 text-sm font-medium mb-6">
              <Brain className="h-3.5 w-3.5" />
              AI-Powered
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Let AI handle the grunt work
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Every incoming ticket is automatically analyzed by AI. It
              classifies the category, detects sentiment, suggests priority —
              and your assignment rules take it from there.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: Tag,
                  text: "Auto-tags with category, sentiment, and priority",
                },
                {
                  icon: ArrowRight,
                  text: "Rule-based routing with drag-and-drop priority",
                },
                {
                  icon: Shield,
                  text: "Full transparency — every AI decision is logged",
                },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 h-5 w-5 rounded-md bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-3 w-3 text-violet-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
