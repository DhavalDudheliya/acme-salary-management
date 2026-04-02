"use client";

import { CreateTicketDialog } from "./create-ticket-dialog";

interface TicketListHeaderProps {
  title: string;
  total: number;
  onSuccess: () => void;
}

export function TicketListHeader({
  title,
  total,
  onSuccess,
}: TicketListHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold">{title} tickets</h1>
        <p className="text-sm text-muted-foreground">
          Showing {total} ticket{total !== 1 ? "s" : ""}
        </p>
      </div>
      <CreateTicketDialog onSuccess={onSuccess} />
    </div>
  );
}
