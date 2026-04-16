"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@supporthub/ui/lib/utils";
import { motion } from "motion/react";

interface NavTabItem {
  label: string;
  href: string;
}

interface NavTabsProps {
  items: NavTabItem[];
  ariaLabel?: string;
  className?: string;
  baseHref?: string;
}

export function NavTabs({
  items,
  ariaLabel = "Navigation",
  className,
  baseHref,
}: NavTabsProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-background border-b border-border sticky top-0 z-10 px-4 sm:px-8 shadow-sm",
        className,
      )}
    >
      <nav className="flex space-x-8" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = baseHref
            ? item.href === baseHref
              ? pathname === item.href
              : pathname?.startsWith(item.href)
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors duration-200 focus-visible:outline-none",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 38,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
