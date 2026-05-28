"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: 10000, suffix: "+", label: "Tickets Resolved", prefix: "" },
  { value: 99.9, suffix: "%", label: "Uptime SLA", prefix: "" },
  { value: 60, suffix: "%", label: "Faster Response", prefix: "" },
  { value: 5, suffix: " min", label: "Average Setup", prefix: "<" },
];

function AnimatedCounter({
  value,
  suffix,
  prefix,
  isInView,
}: {
  value: number;
  suffix: string;
  prefix: string;
  isInView: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCurrent(value);
        clearInterval(timer);
      } else {
        // Ease out cubic
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * value * 10) / 10);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const displayValue =
    value >= 1000
      ? `${(current / 1000).toFixed(current >= value ? 0 : 1)}K`
      : value % 1 !== 0
        ? current.toFixed(1)
        : Math.round(current).toString();

  return (
    <span className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-24 relative">
      {/* Subtle top/bottom glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[200px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`text-center ${i < stats.length - 1 ? "lg:border-r lg:border-white/[0.06]" : ""}`}
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                isInView={isInView}
              />
              <p className="mt-2 text-sm text-white/30 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
