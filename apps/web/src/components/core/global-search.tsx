"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CornerDownLeft, Loader2, Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@supporthub/ui/components/command";
import { Badge } from "@supporthub/ui/components/badge";
import { Skeleton } from "@supporthub/ui/components/skeleton";
import { cn } from "@supporthub/ui/lib/utils";
import { useTicketSearch } from "@/hooks/use-ticket-search";
import type { SearchTicketResult } from "@/lib/services/search.service";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusTone(status: SearchTicketResult["status"]) {
  switch (status) {
    case "OPEN":
      return "default" as const;
    case "PENDING":
      return "secondary" as const;
    case "SOLVED":
      return "outline" as const;
    case "CLOSED":
      return "ghost" as const;
    default:
      return "outline" as const;
  }
}

function formatPriority(priority: SearchTicketResult["priority"]) {
  return priority.charAt(0) + priority.slice(1).toLowerCase();
}

/** Neutral selection styles — avoids workspace accent (often purple) on cmdk items. */
const commandItemClassName = cn(
  "group/command-item relative cursor-pointer rounded-none border-0 p-0",
  "!bg-transparent aria-selected:!bg-transparent data-[selected=true]:!bg-transparent",
  "data-selected:!bg-transparent data-selected:!text-foreground",
  "aria-selected:[&>div]:bg-muted/60 data-[selected=true]:[&>div]:bg-muted/60",
  "aria-selected:[&_[data-open-hint]]:inline-flex data-[selected=true]:[&_[data-open-hint]]:inline-flex",
  "[&>svg:last-child]:hidden",
);

function SearchFooter() {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <kbd className="rounded border border-border bg-background px-1 font-mono text-[10px]">
          ↑
        </kbd>
        <kbd className="rounded border border-border bg-background px-1 font-mono text-[10px]">
          ↓
        </kbd>
        <span className="ml-0.5">navigate</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <kbd className="rounded border border-border bg-background px-1 font-mono text-[10px]">
          ↵
        </kbd>
        <span>open</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <kbd className="rounded border border-border bg-background px-1 font-mono text-[10px]">
          esc
        </kbd>
        <span>close</span>
      </span>
    </div>
  );
}

function TicketSearchItem({
  ticket,
  onSelect,
}: {
  ticket: SearchTicketResult;
  onSelect: (id: string) => void;
}) {
  return (
    <CommandItem
      value={ticket.id}
      keywords={[
        String(ticket.ticketNumber),
        ticket.subject,
        ticket.customer.name,
        ticket.customer.email,
      ]}
      onSelect={() => onSelect(ticket.id)}
      className={commandItemClassName}
    >
      <div className="w-full border-b border-border px-4 py-3.5 transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                #{ticket.ticketNumber}
              </span>
              <Badge variant={statusTone(ticket.status)}>{ticket.status}</Badge>
              <Badge variant="outline">{formatPriority(ticket.priority)}</Badge>
            </div>
            <div className="min-w-0">
              <p className="font-medium leading-snug text-foreground">
                {ticket.subject}
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {ticket.customer.name} • {ticket.customer.email}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-1 text-sm text-muted-foreground sm:items-end sm:text-right">
            <p>
              Updated{" "}
              {formatDistanceToNow(new Date(ticket.updatedAt), {
                addSuffix: true,
              })}
            </p>
            <p>
              {ticket.assignee
                ? `Assigned to ${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                : "No assignee yet"}
            </p>
            <span
              data-open-hint
              className="mt-0.5 hidden items-center gap-1 text-xs font-medium text-foreground"
            >
              Open
              <CornerDownLeft className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </CommandItem>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-3 px-4 py-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
      ))}
    </div>
  );
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTicketId, setActiveTicketId] = useState<string | undefined>();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveTicketId(undefined);
    }
  }, [open]);

  const { data, isFetching, isError, debouncedQuery } = useTicketSearch(
    open ? query : "",
  );
  const tickets = data?.tickets ?? [];

  useEffect(() => {
    setActiveTicketId(tickets[0]?.id);
  }, [tickets]);

  const trimmedQuery = query.trim();
  const trimmedDebounced = debouncedQuery.trim();
  const isShortQuery = trimmedQuery.length > 0 && trimmedQuery.length < 2;
  const isReadyToSearch = trimmedDebounced.length >= 2;
  const showSkeleton = isReadyToSearch && isFetching && tickets.length === 0;
  const showResults = tickets.length > 0;
  const showNoResults =
    isReadyToSearch && !isFetching && !isError && tickets.length === 0;

  const handleSelect = (ticketId: string) => {
    onOpenChange(false);
    router.push(`/tickets/${ticketId}`);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search tickets"
      description="Search tickets by subject, description, or ticket number"
      className="gap-0 overflow-hidden p-0 sm:max-w-2xl"
    >
      <Command
        shouldFilter={false}
        loop
        value={activeTicketId}
        onValueChange={setActiveTicketId}
        className="rounded-none bg-popover p-0 [&_[cmdk-group]]:p-0 [&_[cmdk-group-heading]]:hidden"
      >
        <div className="border-b border-border bg-background px-4 pb-4 pt-4 [&_[data-slot=command-input-wrapper]]:p-0">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Search tickets
          </p>
          <CommandInput
            placeholder="Subject, customer, email, or #ticket number..."
            value={query}
            onValueChange={setQuery}
            className="h-10"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Results match your recent ticket activity layout.
          </p>
        </div>

        <CommandList className="max-h-[min(460px,58vh)] scroll-py-0">
          {trimmedQuery.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Find a ticket</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Search by subject, customer name, email, or ticket number like{" "}
                <span className="font-mono text-foreground">#110</span>
              </p>
            </div>
          )}

          {isShortQuery && (
            <CommandEmpty className="py-12 text-muted-foreground">
              Type at least 2 characters to search
            </CommandEmpty>
          )}

          {showSkeleton && <SearchSkeleton />}

          {isReadyToSearch && isFetching && tickets.length > 0 && (
            <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating results…
            </div>
          )}

          {isReadyToSearch && isError && (
            <CommandEmpty className="py-12">
              Something went wrong. Please try again.
            </CommandEmpty>
          )}

          {showNoResults && (
            <CommandEmpty className="py-12">
              No tickets found for &ldquo;{trimmedDebounced}&rdquo;
            </CommandEmpty>
          )}

          {showResults && (
            <CommandGroup
              heading={`${tickets.length} results`}
              className="overflow-hidden"
            >
              {tickets.map((ticket) => (
                <TicketSearchItem
                  key={ticket.id}
                  ticket={ticket}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          )}
        </CommandList>

        <SearchFooter />
      </Command>
    </CommandDialog>
  );
}
