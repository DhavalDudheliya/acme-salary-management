"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ticketService, type Ticket } from "@/lib/services/ticket.service";
import { toast } from "sonner";

import { TicketDetailHeader } from "@/components/tickets/detail/ticket-detail-header";
import { TicketConversation } from "@/components/tickets/detail/ticket-conversation";
import { TicketReplyEditor } from "@/components/tickets/detail/ticket-reply-editor";
import { TicketPropertiesSidebar } from "@/components/tickets/detail/ticket-properties-sidebar";

export function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketService.get(ticketId);
      setTicket(data);
    } catch {
      toast.error("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) fetchTicket();
  }, [ticketId, fetchTicket]);

  const handleAddComment = async (body: string, isInternal: boolean) => {
    setSubmitting(true);
    try {
      await ticketService.addComment(ticketId, {
        body,
        isInternal,
      });
      fetchTicket();
      toast.success(isInternal ? "Internal note added" : "Reply sent");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProperty = async (field: string, value: any) => {
    try {
      await ticketService.update(ticketId, { [field]: value });
      fetchTicket();
      toast.success(`Ticket ${field} updated`);
    } catch {
      toast.error(`Failed to update ${field}`);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="flex items-center justify-center p-16 text-muted-foreground">
        Loading ticket...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <TicketDetailHeader
        subject={ticket.subject}
        ticketNumber={ticket.ticketNumber}
        status={ticket.status}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <TicketConversation ticket={ticket} />
          <TicketReplyEditor
            onAddComment={handleAddComment}
            submitting={submitting}
          />
        </div>

        <TicketPropertiesSidebar
          ticket={ticket}
          onUpdateProperty={handleUpdateProperty}
        />
      </div>
    </div>
  );
}
