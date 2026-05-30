"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Twitter, Linkedin, ArrowUp } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "mailto:hello@supporthub.io" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export function MarketingFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0a0a12] border-t border-white/[0.04]">
      {/* Animated gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center mb-6 group">
              <img
                src="/logos/logo.png"
                alt="SupportHub Logo"
                className="h-8 w-auto object-contain transition-opacity hover:opacity-90"
              />
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-8">
              The modern customer support platform that turns emails into
              tickets automatically. Built for teams that care about speed and
              simplicity.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white mb-6">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.links.map((link) => {
                  const isHashLink =
                    link.href.startsWith("#") && link.href !== "#";
                  const resolvedHref = isHashLink
                    ? isHome
                      ? link.href
                      : `/${link.href}`
                    : link.href;

                  return (
                    <li key={link.label}>
                      <Link
                        href={resolvedHref}
                        className="text-sm text-white/40 hover:text-white transition-colors relative group/link inline-block"
                      >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/30 group-hover/link:w-full transition-all duration-300" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} SupportHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-xs text-white/20">
              Designed with 🖤 for Support Teams
            </p>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/[0.03] text-white/30 hover:text-white hover:bg-white/[0.08] transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
