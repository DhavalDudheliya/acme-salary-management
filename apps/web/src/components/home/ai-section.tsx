"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import { Brain, Tag, ArrowRight, Shield, Sparkles } from "lucide-react";

const emailText =
  "Hi, I was charged twice for my last order (#12345). I see two identical pending transactions on my bank statement. Can you please help resolve this ASAP? I need the duplicate charge reversed.";

const tags = [
  {
    label: "billing",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    delay: 0,
  },
  {
    label: "refund",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    delay: 0.15,
  },
  {
    label: "high-priority",
    color: "bg-red-500/15 text-red-400 border-red-500/20",
    delay: 0.3,
  },
  {
    label: "negative sentiment",
    color: "bg-pink-500/15 text-pink-400 border-pink-500/20",
    delay: 0.45,
  },
];

export function AISection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });
  const [typedLength, setTypedLength] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Type out email
    let charIndex = 0;
    const typeTimer = setInterval(() => {
      charIndex++;
      setTypedLength(charIndex);
      if (charIndex >= emailText.length) {
        clearInterval(typeTimer);
        // Start analysis after typing
        setTimeout(() => setShowAnalysis(true), 400);
        setTimeout(() => {
          setShowTags(true);
          // Count up confidence
          let conf = 0;
          const confTimer = setInterval(() => {
            conf += 2;
            setConfidence(Math.min(conf, 97));
            if (conf >= 97) clearInterval(confTimer);
          }, 20);
        }, 1200);
        setTimeout(() => setShowAssignment(true), 2400);
      }
    }, 18);

    return () => clearInterval(typeTimer);
  }, [isInView]);

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Live Demo Card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl border border-white/[0.06] bg-[#0c0c16] p-6 shadow-xl">
              {/* Email header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.04]">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.06] flex items-center justify-center text-xs font-bold text-white/50">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white/80">
                    Jane Doe
                  </p>
                  <p className="text-xs text-white/25">jane.doe@example.com</p>
                </div>
                <span className="text-[10px] text-white/15">Just now</span>
              </div>

              {/* Subject */}
              <h4 className="text-sm font-semibold text-white/70 mb-2">
                Billing Issue — Order #12345
              </h4>

              {/* Typing email body */}
              <p className="text-xs text-white/35 leading-relaxed mb-5 min-h-[3.5rem]">
                {emailText.slice(0, typedLength)}
                {typedLength < emailText.length && (
                  <span className="inline-block w-0.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse" />
                )}
              </p>

              {/* AI Processing indicator */}
              <AnimatePresence>
                {showAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-4 text-xs text-violet-400 font-medium"
                  >
                    <Brain className="h-3.5 w-3.5 animate-pulse" />
                    <span>AI analyzing ticket...</span>
                    {confidence > 0 && (
                      <span className="ml-auto font-mono text-[10px] text-violet-400/60">
                        Confidence: {confidence}%
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tags with spring animation */}
              <AnimatePresence>
                {showTags && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mb-4"
                  >
                    {tags.map((tag) => (
                      <motion.span
                        key={tag.label}
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                          delay: tag.delay,
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${tag.color}`}
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag.label}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Assignment result */}
              <AnimatePresence>
                {showAssignment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-xs font-medium text-emerald-400"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>Auto-assigned to Billing Team</span>
                    <Sparkles className="h-3 w-3 ml-auto text-emerald-400/50" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ambient glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/8 to-primary/8 rounded-3xl blur-2xl -z-10" />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-semibold mb-6">
              <Brain className="h-3.5 w-3.5" />
              AI-Powered
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Let AI handle the grunt work
            </h2>
            <p className="text-lg text-white/40 mb-8 leading-relaxed">
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
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="mt-0.5 h-6 w-6 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-white/40">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
