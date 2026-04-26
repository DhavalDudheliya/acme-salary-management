import React from "react";
import { useRouter } from "next/navigation";
import { Clock, Tag, ArrowRight } from "lucide-react";
import { cn } from "@supporthub/ui/lib/utils";
import { type AIDecisionLog } from "@/lib/services/automation.service";
import { CATEGORY_COLORS } from "./constants";

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function AILogItem({ log }: { log: AIDecisionLog }) {
  const router = useRouter();

  const applied = log.tagsApplied as Array<{
    name: string;
    category: string;
    confidence: number;
  }>;
  const suggested = log.tagsSuggested as Array<{
    name: string;
    category: string;
    confidence: number;
  }>;

  const handleTicketClick = () => {
    router.push(`/tickets/${log.ticket?.id}`);
  };

  return (
    <div
      className="group rounded-lg border bg-background p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleTicketClick}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: ticket info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-muted-foreground">
              #{log.ticket?.ticketNumber}
            </span>
            <span className="text-sm font-medium truncate">
              {log.ticket?.subject}
            </span>
          </div>

          {/* Tags applied */}
          {applied.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <Tag className="h-3 w-3 text-green-500" />
              {applied.map((t, i) => (
                <span
                  key={i}
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                    CATEGORY_COLORS[t.category] || "bg-muted",
                  )}
                >
                  {t.name}
                  <span className="opacity-60 ml-0.5">
                    {Math.round(t.confidence * 100)}%
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Tags suggested */}
          {suggested.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <Tag className="h-3 w-3 text-amber-500" />
              {suggested.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium border border-dashed"
                >
                  {t.name}
                  <span className="opacity-60 ml-0.5">
                    {Math.round(t.confidence * 100)}%
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Rule match */}
          {log.ruleName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowRight className="h-3 w-3" />
              Rule: <strong>{log.ruleName}</strong>
            </div>
          )}
        </div>

        {/* Right: metadata */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {log.prioritySet && (
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider",
                PRIORITY_COLORS[log.prioritySet],
              )}
            >
              {log.prioritySet}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {log.processingMs}ms
          </div>
          <span className="text-[10px] text-muted-foreground/70">
            {new Date(log.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
