"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, Zap, Users } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Mail,
    title: "Connect",
    description:
      "Link your Gmail or Outlook account in one click. OAuth-based — no passwords stored.",
    colorClass:
      "text-blue-400 border-blue-500/20 bg-[#0d1527] group-hover:bg-[#101b33] group-hover:border-blue-500/40",
    glowColor: "rgba(59, 130, 246, 0.12)",
    gradient: "bg-linear-to-br from-blue-500 to-cyan-400",
  },
  {
    num: "02",
    icon: Zap,
    title: "Automate",
    description:
      "Inbound emails become tickets instantly. AI tags them, rules route them to the right agent.",
    colorClass:
      "text-amber-400 border-amber-500/20 bg-[#1a140d] group-hover:bg-[#241a0d] group-hover:border-amber-500/40",
    glowColor: "rgba(245, 158, 11, 0.12)",
    gradient: "bg-linear-to-br from-amber-500 to-orange-400",
  },
  {
    num: "03",
    icon: Users,
    title: "Resolve",
    description:
      "Collaborate with your team in real-time. Reply, add notes, and close tickets — all from one place.",
    colorClass:
      "text-emerald-400 border-emerald-500/20 bg-[#0d1a15] group-hover:bg-[#10241b] group-hover:border-emerald-500/40",
    glowColor: "rgba(16, 185, 129, 0.12)",
    gradient: "bg-linear-to-br from-emerald-500 to-green-400",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-semibold text-emerald-400 tracking-wide uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Up and running in minutes
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Three simple steps to transform your email inbox into a powerful
            support system.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting beam line */}
          <div className="hidden md:block absolute top-[6.5rem] left-[16.67%] right-[16.67%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-blue-500/40 via-amber-500/40 to-emerald-500/40 origin-left"
            />
            {/* Glow on the beam */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="absolute inset-0 h-px bg-linear-to-r from-blue-500/20 via-amber-500/20 to-emerald-500/20 blur-sm origin-left"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step number */}
                <div className="text-6xl font-black text-white/4 mb-3 select-none">
                  {step.num}
                </div>

                {/* Icon and Pulse Wrapper */}
                <div className="relative mb-6">
                  {/* Pulse ring (soft expanding gradient behind the icon) */}
                  <motion.div
                    initial={{ scale: 1, opacity: 0.4 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                    className={`absolute inset-0 rounded-2xl ${step.gradient} -z-10 blur-xs`}
                  />

                  {/* Icon container */}
                  <div
                    className={`relative inline-flex items-center justify-center h-16 w-16 rounded-2xl border ${step.colorClass} shadow-lg transition-all duration-300 z-10`}
                    style={{
                      boxShadow: `0 12px 40px ${step.glowColor}`,
                    }}
                  >
                    <step.icon className="h-7 w-7" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/35 leading-relaxed max-w-[260px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Google OAuth & Gmail Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 max-w-3xl mx-auto rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]" />

          <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
            <div className="flex items-center justify-center p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.694 0-8.503-3.809-8.503-8.503s3.809-8.503 8.503-8.503c2.25 0 4.18.847 5.632 2.206l3.125-3.125C18.618 1.155 15.68 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.887 0 12.24-5.361 12.24-12.24 0-.766-.085-1.503-.243-2.206l-12 1.051z" />
              </svg>
            </div>

            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Google Integration & OAuth Transparency Disclosure
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                SupportHub offers an optional integration with Google to
                simplify customer communication. You can link your support Gmail
                inbox to automate ticketing seamlessly:
              </p>

              <ul className="grid sm:grid-cols-2 gap-4 text-xs text-white/40">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white">
                      Read-Only Inbox Access:
                    </strong>{" "}
                    We request the <code>gmail.readonly</code> scope to sync and
                    convert incoming customer support emails into tickets
                    automatically.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white">
                      Strict Isolation & Security:
                    </strong>{" "}
                    OAuth credentials and support message payloads are
                    completely isolated within your secure workspace tenant.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white">Zero Marketing Use:</strong>{" "}
                    We strictly do not use or transfer your email content for
                    advertising, profiling, or sharing with external brokers.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white">Revoke Anytime:</strong> You
                    retain full control. Disconnect your inbox or revoke
                    authorization instantly from your dashboard or Google
                    Account Settings.
                  </span>
                </li>
              </ul>

              <p className="text-xs text-white/30 pt-4 border-t border-white/[0.04] leading-relaxed">
                Our practices strictly adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements. For complete
                information, see our{" "}
                <Link
                  href="/privacy"
                  className="text-violet-400 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
