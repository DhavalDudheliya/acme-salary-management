"use client";

import { ListChecks } from "lucide-react";
import { DataTable } from "@supporthub/ui/components/data-table";
import { columns } from "./ticket-columns";
import { Loading } from "@supporthub/ui/components/loading";
import { type Ticket } from "@/lib/services/ticket.service";

interface TicketListContentProps {
  loading: boolean;
  tickets: Ticket[];
  onRowClick: (ticket: Ticket) => void;
}

export function TicketListContent({
  loading,
  tickets,
  onRowClick,
}: TicketListContentProps) {
  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      {loading ? (
        <Loading />
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <ListChecks className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium">No tickets found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There are no tickets matching this view.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={tickets} onRowClick={onRowClick} />
      )}
    </div>
  );
}
