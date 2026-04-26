"use client";

import React from "react";
import { motion } from "motion/react";
import { Mail, Zap, Users } from "lucide-react";

const steps = [
  {
    num: "1",
    icon: Mail,
    title: "Connect",
    description:
      "Link your Gmail or Outlook account in one click. OAuth-based — no passwords stored.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    line: "from-blue-500/40 to-amber-500/40",
  },
  {
    num: "2",
    icon: Zap,
    title: "Automate",
    description:
      "Inbound emails become tickets instantly. AI tags them, rules route them to the right agent.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    line: "from-amber-500/40 to-green-500/40",
  },
  {
    num: "3",
    icon: Users,
    title: "Resolve",
    description:
      "Collaborate with your team in real-time. Reply, add notes, and close tickets — all from one place.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    line: "",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Up and running in minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your email inbox into a powerful
            support system.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-0 relative max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center px-6"
            >
              {/* Connector line (desktop only, not on last item) */}
              {i < steps.length - 1 && (
                <div
                  className={`hidden md:block absolute top-8 left-[60%] right-[-40%] h-px bg-gradient-to-r ${step.line}`}
                />
              )}

              {/* Step number */}
              <div
                className={`text-5xl font-bold ${step.color} opacity-15 mb-3`}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl ${step.bg} border ${step.border} mb-5`}
              >
                <step.icon className={`h-6 w-6 ${step.color}`} />
              </div>

              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
