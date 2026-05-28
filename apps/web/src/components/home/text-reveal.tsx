"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
  staggerDelay?: number;
  splitBy?: "char" | "word";
  once?: boolean;
}

export function TextReveal({
  children,
  className = "",
  as: Tag = "span",
  delay = 0,
  staggerDelay = 0.03,
  splitBy = "word",
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const units =
    splitBy === "char" ? children.split("") : children.split(/(\s+)/);

  return (
    <Tag ref={ref as React.RefObject<any>} className={className}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 24, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {unit}
        </motion.span>
      ))}
    </Tag>
  );
}
