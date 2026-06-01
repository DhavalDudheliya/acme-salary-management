"use client";

import { Search } from "lucide-react";

interface HeaderSearchTriggerProps {
  isMac: boolean;
  onOpen: () => void;
}

export function HeaderSearchTrigger({
  isMac,
  onOpen,
}: HeaderSearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative flex h-9 flex-1 max-w-xl items-center rounded-lg border border-border bg-muted/40 pl-9 pr-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      aria-label="Search tickets"
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <span className="truncate">Search tickets...</span>
      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
        {isMac ? "⌘K" : "Ctrl+K"}
      </kbd>
    </button>
  );
}
