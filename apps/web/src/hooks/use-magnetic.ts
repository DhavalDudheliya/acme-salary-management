"use client";

import { useCallback } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";

interface MagneticOptions {
  strength?: number;
  radius?: number;
  damping?: number;
  stiffness?: number;
}

interface MagneticReturn {
  x: MotionValue<number>;
  y: MotionValue<number>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
}

export function useMagnetic(
  ref: React.RefObject<HTMLElement | null>,
  options: MagneticOptions = {},
): MagneticReturn {
  const { strength = 0.35, damping = 15, stiffness = 150 } = options;

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);

  const x = useSpring(xRaw, { damping, stiffness });
  const y = useSpring(yRaw, { damping, stiffness });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xRaw.set(deltaX);
      yRaw.set(deltaY);
    },
    [ref, strength, xRaw, yRaw],
  );

  const handleMouseLeave = useCallback(() => {
    xRaw.set(0);
    yRaw.set(0);
  }, [xRaw, yRaw]);

  return { x, y, handleMouseMove, handleMouseLeave };
}
