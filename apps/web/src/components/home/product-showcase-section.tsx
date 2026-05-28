"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@supporthub/ui/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Tag,
  ArrowUpRight,
  BarChart3,
  User,
} from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "customers", label: "Customers", icon: Users },
];

// ── Mock Dashboard UI ──
function MockDashboard() {
  const statCards = [
    {
      label: "Open Tickets",
      value: "127",
      change: "+12%",
      up: true,
      icon: Ticket,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Avg. Response",
      value: "2.4h",
      change: "-18%",
      up: false,
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Resolved Today",
      value: "43",
      change: "+24%",
      up: true,
      icon: CheckCircle2,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "CSAT Score",
      value: "96%",
      change: "+3%",
      up: true,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="p-5 space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${card.bg}`}>
                <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
              <span
                className={`text-[10px] font-medium ${card.up ? "text-emerald-400" : "text-blue-400"}`}
              >
                {card.change}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{card.value}</p>
            <p className="text-[10px] text-white/30">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart area + Recent tickets */}
      <div className="grid grid-cols-5 gap-3">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white/70">Ticket Volume</p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-blue-500/10 text-blue-400">
                7D
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-medium text-white/20">
                30D
              </span>
            </div>
          </div>
          {/* Fake chart bars */}
          <div className="flex items-end gap-1.5 h-24">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600/60 to-blue-400/40"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span
                key={d}
                className="text-[8px] text-white/15 flex-1 text-center"
              >
                {d}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Recent tickets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
        >
          <p className="text-xs font-semibold text-white/70 mb-3">
            Recent Activity
          </p>
          <div className="space-y-2.5">
            {[
              {
                title: "Billing issue #1234",
                status: "open",
                time: "2m ago",
              },
              {
                title: "Login bug report",
                status: "in-progress",
                time: "15m ago",
              },
              {
                title: "Feature request",
                status: "resolved",
                time: "1h ago",
              },
              {
                title: "API rate limit",
                status: "open",
                time: "2h ago",
              },
            ].map((ticket, i) => (
              <motion.div
                key={ticket.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-2"
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    ticket.status === "open"
                      ? "bg-amber-400"
                      : ticket.status === "in-progress"
                        ? "bg-blue-400"
                        : "bg-emerald-400"
                  }`}
                />
                <span className="text-[10px] text-white/50 truncate flex-1">
                  {ticket.title}
                </span>
                <span className="text-[9px] text-white/20 flex-shrink-0">
                  {ticket.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Mock Tickets UI ──
function MockTickets() {
  const tickets = [
    {
      id: "#1247",
      subject: "Cannot process refund for order",
      customer: "Sarah Chen",
      priority: "high",
      status: "Open",
      tags: ["billing", "refund"],
      time: "2 min ago",
    },
    {
      id: "#1246",
      subject: "Login page shows blank screen",
      customer: "James Wilson",
      priority: "critical",
      status: "In Progress",
      tags: ["bug", "auth"],
      time: "15 min ago",
    },
    {
      id: "#1245",
      subject: "Feature request: Dark mode",
      customer: "Maria Garcia",
      priority: "low",
      status: "Open",
      tags: ["feature-request"],
      time: "1 hour ago",
    },
    {
      id: "#1244",
      subject: "API rate limit exceeded on prod",
      customer: "Alex Kim",
      priority: "high",
      status: "In Progress",
      tags: ["api", "infrastructure"],
      time: "2 hours ago",
    },
    {
      id: "#1243",
      subject: "Export CSV not including all fields",
      customer: "Priya Patel",
      priority: "medium",
      status: "Resolved",
      tags: ["export", "data"],
      time: "3 hours ago",
    },
  ];

  return (
    <div className="p-5">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[10px] text-white/40 font-medium">
            All Tickets
          </div>
          <div className="px-3 py-1.5 rounded-lg text-[10px] text-white/20 font-medium">
            My Assigned
          </div>
          <div className="px-3 py-1.5 rounded-lg text-[10px] text-white/20 font-medium">
            Unassigned
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 text-[10px] text-blue-400 font-medium">
          + New Ticket
        </div>
      </motion.div>

      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] text-white/20 uppercase tracking-wider font-semibold border-b border-white/[0.04]">
        <span className="col-span-1">ID</span>
        <span className="col-span-4">Subject</span>
        <span className="col-span-2">Customer</span>
        <span className="col-span-1">Priority</span>
        <span className="col-span-2">Tags</span>
        <span className="col-span-1">Status</span>
        <span className="col-span-1">Time</span>
      </div>

      {/* Rows */}
      {tickets.map((ticket, i) => (
        <motion.div
          key={ticket.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.06 }}
          className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
        >
          <span className="col-span-1 text-[10px] text-white/30 font-mono">
            {ticket.id}
          </span>
          <span className="col-span-4 text-[10px] text-white/60 font-medium truncate group-hover:text-white/80 transition-colors">
            {ticket.subject}
          </span>
          <span className="col-span-2 text-[10px] text-white/30 truncate">
            {ticket.customer}
          </span>
          <span className="col-span-1">
            <span
              className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                ticket.priority === "critical"
                  ? "bg-red-500/15 text-red-400"
                  : ticket.priority === "high"
                    ? "bg-amber-500/15 text-amber-400"
                    : ticket.priority === "medium"
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-white/[0.06] text-white/30"
              }`}
            >
              {ticket.priority}
            </span>
          </span>
          <div className="col-span-2 flex gap-1 overflow-hidden">
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-[8px] bg-white/[0.04] text-white/25 truncate"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="col-span-1">
            <span
              className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-medium ${
                ticket.status === "Open"
                  ? "bg-amber-500/10 text-amber-400"
                  : ticket.status === "In Progress"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {ticket.status}
            </span>
          </span>
          <span className="col-span-1 text-[9px] text-white/15">
            {ticket.time}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Mock Customers UI ──
function MockCustomers() {
  const customers = [
    {
      name: "Sarah Chen",
      email: "sarah@techflow.io",
      tickets: 12,
      lastSeen: "2m ago",
      avatar: "SC",
    },
    {
      name: "James Wilson",
      email: "james@cloudbase.com",
      tickets: 8,
      lastSeen: "1h ago",
      avatar: "JW",
    },
    {
      name: "Maria Garcia",
      email: "maria@datasync.co",
      tickets: 5,
      lastSeen: "3h ago",
      avatar: "MG",
    },
    {
      name: "Alex Kim",
      email: "alex@nextera.dev",
      tickets: 15,
      lastSeen: "5m ago",
      avatar: "AK",
    },
    {
      name: "Priya Patel",
      email: "priya@orbis.io",
      tickets: 3,
      lastSeen: "1d ago",
      avatar: "PP",
    },
  ];

  return (
    <div className="p-5">
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/20">
          Search customers...
        </div>
        <div className="px-3 py-2 rounded-lg bg-white/[0.06] text-[10px] text-white/30 font-medium">
          Filters
        </div>
      </motion.div>

      {/* Customer cards */}
      <div className="space-y-2">
        {customers.map((customer, i) => (
          <motion.div
            key={customer.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/50">
              {customer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white/70 group-hover:text-white/90 transition-colors">
                {customer.name}
              </p>
              <p className="text-[9px] text-white/25">{customer.email}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40">
                {customer.tickets} tickets
              </p>
              <p className="text-[9px] text-white/15">{customer.lastSeen}</p>
            </div>
            <ArrowUpRight className="h-3 w-3 text-white/10 group-hover:text-white/30 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <section id="product" className="py-24 sm:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/4 rounded-full blur-[120px]" />
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
          <p className="text-sm font-semibold text-violet-400 tracking-wide uppercase mb-3">
            Product
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            See it in action
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
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
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-white"
                      : "text-white/30 hover:text-white/50",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="product-tab-bg"
                      className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.06]"
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

        {/* Product display */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/[0.06] bg-[#0c0c16] shadow-2xl shadow-black/40 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/[0.06] hover:bg-red-400/60 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-white/[0.06] hover:bg-yellow-400/60 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-white/[0.06] hover:bg-green-400/60 transition-colors" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-white/[0.03] border border-white/[0.04] text-[10px] text-white/20 font-mono">
                  app.supporthub.io/{activeTab}
                </div>
              </div>
            </div>

            {/* Sidebar + Content area */}
            <div className="flex min-h-[380px]">
              {/* Mini sidebar */}
              <div className="hidden sm:flex w-12 flex-col items-center gap-3 py-4 border-r border-white/[0.04] bg-white/[0.01]">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center text-[8px] font-bold text-white/40">
                  S
                </div>
                <div className="w-full h-px bg-white/[0.04]" />
                {[LayoutDashboard, Ticket, Users, BarChart3].map((Icon, i) => (
                  <div
                    key={i}
                    className={`p-1.5 rounded-lg transition-colors ${
                      i === tabs.findIndex((t) => t.id === activeTab)
                        ? "bg-white/[0.06] text-white/50"
                        : "text-white/15 hover:text-white/30"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === "dashboard" && (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MockDashboard />
                    </motion.div>
                  )}
                  {activeTab === "tickets" && (
                    <motion.div
                      key="tickets"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MockTickets />
                    </motion.div>
                  )}
                  {activeTab === "customers" && (
                    <motion.div
                      key="customers"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MockCustomers />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Ambient glow */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/5 via-violet-600/5 to-cyan-600/5 rounded-3xl blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
