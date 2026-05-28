"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@supporthub/ui/lib/utils";

const tiers = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "forever",
    description: "For small teams getting started with support.",
    cta: "Start Free Trial",
    ctaHref: "/register",
    highlighted: false,
    features: [
      "Up to 3 agents",
      "100 tickets / month",
      "Email-to-ticket (1 inbox)",
      "Basic dashboard",
      "14-day Pro trial included",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 24,
    period: "per agent / month",
    description: "For growing teams that need AI and automation.",
    cta: "Start Free Trial",
    ctaHref: "/register",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited agents",
      "Unlimited tickets",
      "Gmail & Outlook integration",
      "AI auto-tagging",
      "Assignment rules & routing",
      "Real-time WebSocket updates",
      "Internal notes & collaboration",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: -1,
    yearlyPrice: -1,
    period: "",
    description:
      "For organizations with advanced security and compliance needs.",
    cta: "Contact Us",
    ctaHref: "mailto:sales@supporthub.io",
    highlighted: false,
    features: [
      "Everything in Pro",
      "SSO / SAML authentication",
      "Dedicated account manager",
      "Custom SLA",
      "Advanced audit logs",
      "On-premise deployment option",
    ],
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 sm:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-600/4 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-cyan-400 tracking-wide uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-8">
            Start free with a 14-day Pro trial. No credit card required. Upgrade
            when you&apos;re ready.
          </p>

          {/* Monthly / Yearly toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-white/4 border border-white/6">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                !isYearly
                  ? "bg-white/8 text-white shadow-sm"
                  : "text-white/30 hover:text-white/50",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                isYearly
                  ? "bg-white/8 text-white shadow-sm"
                  : "text-white/30 hover:text-white/50",
              )}
            >
              Yearly
              <span className="text-[10px] text-emerald-400 font-semibold">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 lg:p-8 transition-all duration-500",
                tier.highlighted
                  ? "border-primary/30 bg-white/3 shadow-xl shadow-primary/5 scale-[1.02]"
                  : "border-white/6 bg-white/1 hover:border-white/10",
              )}
            >
              {/* Highlighted card glow */}
              {tier.highlighted && (
                <>
                  <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-primary/20 via-transparent to-primary/10 -z-10" />
                  <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-20" />
                </>
              )}

              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary border border-primary/20 text-primary-foreground text-[10px] font-bold shadow-lg shadow-primary/20 uppercase tracking-wider">
                    <Sparkles className="h-2.5 w-2.5" />
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-xs text-white/25 mb-4">{tier.description}</p>
                <div className="flex items-baseline gap-1">
                  {tier.monthlyPrice >= 0 ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-white">
                        ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                      </span>
                      {tier.period && (
                        <span className="text-sm text-white/20">
                          /{tier.period}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold tracking-tight text-white">
                      Custom
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, fi) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + fi * 0.05 }}
                    className="flex items-start gap-2.5"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 mt-0.5 flex-shrink-0",
                        tier.highlighted ? "text-primary" : "text-white/20",
                      )}
                    />
                    <span className="text-sm text-white/40">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.ctaHref}
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300",
                  tier.highlighted
                    ? "bg-primary border border-primary/20 text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/15"
                    : "border border-white/8 text-white/60 hover:text-white hover:border-white/15 hover:bg-white/3",
                )}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
