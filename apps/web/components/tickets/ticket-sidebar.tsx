"use client";

import {
  User,
  Users,
  ListChecks,
  Clock,
  Ban,
  Trash2,
  LucideIcon,
} from "lucide-react";
import { cn } from "@supporthub/ui/lib/utils";

export const views = [
  { key: "unsolved", label: "Your unsolved", icon: User },
  { key: "unassigned", label: "Unassigned", icon: Users },
  { key: "all", label: "All unsolved", icon: ListChecks },
  { key: "recent", label: "Recently updated", icon: Clock },
] as const;

export const otherViews = [
  { key: "suspended", label: "Suspended", icon: Ban },
  { key: "trash", label: "Trash", icon: Trash2 },
] as const;

export type ViewKey = (typeof views)[number]["key"];

interface TicketSidebarProps {
  activeView: ViewKey;
  onViewChange: (view: ViewKey) => void;
}

export function TicketSidebar({
  activeView,
  onViewChange,
}: TicketSidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-muted/30 p-4">
      <nav className="space-y-1">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.key;
          return (
            <button
              key={view.key}
              onClick={() => onViewChange(view.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{view.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Others
        </p>
        <nav className="space-y-1">
          {otherViews.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.key}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{view.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
