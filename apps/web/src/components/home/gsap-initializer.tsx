"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function GSAPInitializer() {
  useEffect(() => {
    // Force dark theme for the marketing page
    document.documentElement.classList.add("dark");

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
