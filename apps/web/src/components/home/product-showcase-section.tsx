"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@supporthub/ui/lib/utils";
import { LayoutDashboard, Ticket, Users } from "lucide-react";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    src: "/screenshots/dashboard.png",
    alt: "SupportHub Dashboard — ticket stats, recent activity, and quick actions",
  },
  {
    id: "tickets",
    label: "Tickets",
    icon: Ticket,
    src: "/screenshots/tickets.png",
    alt: "SupportHub Tickets — filterable ticket list with priority badges",
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    src: "/screenshots/customers.png",
    alt: "SupportHub Customers — user management with roles and organizations",
  },
];

export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <section id="product" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A clean, purpose-built interface designed for speed and clarity.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted/60 border border-border/50">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const handleClick = () => setActiveTab(tab.id);

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={handleClick}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="product-tab-bg"
                      className="absolute inset-0 rounded-md bg-background shadow-sm border border-border/50"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Screenshot display */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-xl border border-border/50 bg-background shadow-2xl shadow-black/8 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground font-mono">
                  app.supporthub.io/{activeTab}
                </div>
              </div>
            </div>
            {/* Image */}
            <AnimatePresence mode="wait">
              {tabs.map((tab) =>
                tab.id === activeTab ? (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Image
                      src={tab.src}
                      alt={tab.alt}
                      width={1200}
                      height={800}
                      className="w-full h-auto"
                    />
                  </motion.div>
                ) : null,
              )}
            </AnimatePresence>
          </div>
          {/* Ambient glow */}
          <div className="absolute -inset-6 bg-gradient-to-r from-primary/5 via-blue-500/5 to-indigo-500/5 rounded-2xl blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
