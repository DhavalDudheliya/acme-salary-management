"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ticketService,
  type Ticket,
  type TicketComment,
} from "@/lib/services/ticket.service";
import { toast } from "sonner";
import { ArrowLeft, Send, Lock, MessageSquare } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";
import { Badge } from "@supporthub/ui/components/badge";
import { Textarea } from "@supporthub/ui/components/textarea";
import { Avatar, AvatarFallback } from "@supporthub/ui/components/avatar";
import { Separator } from "@supporthub/ui/components/separator";
import { cn } from "@supporthub/ui/lib/utils";

const statusColors: Record<string, string> = {
  OPEN: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SOLVED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CLOSED: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const statusOptions = ["OPEN", "PENDING", "SOLVED", "CLOSED"];

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params?.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
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

  const handleAddComment = async () => {
    if (!replyBody.trim()) return;
    setSubmitting(true);
    try {
      await ticketService.addComment(ticketId, {
        body: replyBody,
        isInternal,
      });
      setReplyBody("");
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading || !ticket) {
    return (
      <div className="flex items-center justify-center p-16 text-muted-foreground">
        Loading ticket...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-border px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/tickets")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <h1 className="flex-1 text-lg font-semibold truncate">
          {ticket.subject}
        </h1>
        <Badge variant="outline" className="font-mono text-xs">
          #SH-{ticket.ticketNumber}
        </Badge>
        <Badge className={cn("text-xs", statusColors[ticket.status])}>
          {ticket.status}
        </Badge>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Initial ticket message */}
            <div className="flex gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="text-xs">
                  {getInitials(ticket.customer?.name || "?")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">
                    {ticket.customer?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(ticket.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                  {ticket.description}
                </div>
              </div>
            </div>

            {/* Comments */}
            {ticket.comments?.map((comment: TicketComment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      `${comment.author.firstName} ${comment.author.lastName}`,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                    </span>
                    {comment.isInternal && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-yellow-500 text-yellow-600 dark:text-yellow-400"
                      >
                        INTERNAL NOTE
                      </Badge>
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-4 text-sm",
                      comment.isInternal
                        ? "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/20"
                        : "bg-muted/30",
                    )}
                  >
                    {comment.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Editor */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setIsInternal(false)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md font-medium transition-colors",
                  !isInternal
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <MessageSquare className="mr-1.5 inline h-3.5 w-3.5" />
                Public Reply
              </button>
              <button
                onClick={() => setIsInternal(true)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md font-medium transition-colors",
                  isInternal
                    ? "bg-yellow-500 text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Lock className="mr-1.5 inline h-3.5 w-3.5" />
                Internal Note
              </button>
            </div>
            <Textarea
              placeholder="Type your message here..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={3}
              className={cn(
                isInternal &&
                  "border-yellow-300 focus-visible:ring-yellow-500 dark:border-yellow-700",
              )}
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleAddComment}
                disabled={submitting || !replyBody.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                {isInternal ? "Add Note" : "Send Reply"}
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Sidebar */}
        <aside className="w-80 shrink-0 overflow-auto border-l border-border p-5 space-y-6">
          {/* Requester */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Requester
            </p>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {getInitials(ticket.customer?.name || "?")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {ticket.customer?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {ticket.customer?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Properties
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    handleUpdateProperty("status", e.target.value)
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Priority
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) =>
                    handleUpdateProperty("priority", e.target.value)
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Assignee
                </label>
                <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {ticket.assignee ? (
                    <>
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">
                          {getInitials(
                            `${ticket.assignee.firstName} ${ticket.assignee.lastName}`,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {ticket.assignee.firstName} {ticket.assignee.lastName}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ticket.tags?.length ? (
                ticket.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No tags</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
