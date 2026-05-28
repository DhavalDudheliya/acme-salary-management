"use client";

import React from "react";
import { cn } from "@supporthub/ui/lib/utils";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderWidth?: number;
  gradientColors?: string[];
  speed?: number;
}

export function AnimatedGradientBorder({
  children,
  className = "",
  containerClassName = "",
  borderWidth = 1,
  speed = 3,
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative group", containerClassName)}>
      {/* Animated gradient border */}
      <div
        className="absolute -inset-px rounded-[inherit] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from var(--gradient-angle, 0deg), #3b82f6, #8b5cf6, #ec4899, #3b82f6)`,
          animation: `gradient-rotate ${speed}s linear infinite`,
          padding: borderWidth,
        }}
      />
      {/* Inner content */}
      <div className={cn("relative rounded-[inherit] bg-[#0a0a12]", className)}>
        {children}
      </div>
      <style jsx>{`
        @keyframes gradient-rotate {
          to {
            --gradient-angle: 360deg;
          }
        }
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </div>
  );
}
