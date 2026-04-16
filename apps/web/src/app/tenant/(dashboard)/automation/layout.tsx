"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@supporthub/ui/lib/utils";

const automationNav = [
  { label: "Assignment Rules", href: "/automation" },
  { label: "AI Decisions", href: "/automation/ai-logs" },
];

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-full">
      {/* Automation Tab Navigation */}
      <div className="bg-background border-b border-border sticky top-0 z-10 px-4 sm:px-8 shadow-sm">
        <nav className="flex space-x-8" aria-label="Automation Navigation">
          {automationNav.map((item) => {
            const isActive =
              item.href === "/automation"
                ? pathname === "/automation"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
