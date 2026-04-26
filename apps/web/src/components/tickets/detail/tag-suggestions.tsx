"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { cn } from "@supporthub/ui/lib/utils";
import {
  tagSuggestionsService,
  type TagSuggestion,
} from "@/lib/services/automation.service";

const CATEGORY_COLORS: Record<string, string> = {
  ISSUE_TYPE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  DEPARTMENT:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  PRODUCT_AREA:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  SENTIMENT:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  SLA: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

interface TagSuggestionsProps {
  ticketId: string;
  /** Called after a suggestion is accepted, so the parent can refresh tags */
  onTagAccepted?: () => void;
}

export function TagSuggestions({
  ticketId,
  onTagAccepted,
}: TagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = useCallback(async () => {
    try {
      const data = await tagSuggestionsService.list(ticketId);
      setSuggestions(data.filter((s) => s.status === "PENDING"));
    } catch {
      // Silently fail — suggestions are non-critical
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleReview = async (
    suggestion: TagSuggestion,
    action: "accept" | "reject",
  ) => {
    // Optimistic removal
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));

    try {
      await tagSuggestionsService.review(ticketId, suggestion.id, action);
      if (action === "accept" && onTagAccepted) {
        onTagAccepted();
      }
    } catch {
      // Rollback
      fetchSuggestions();
    }
  };

  if (loading || suggestions.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Suggestions
        </p>
      </div>
      <div className="space-y-1.5">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-2 rounded-md bg-muted/50 border border-dashed px-2.5 py-1.5 group"
          >
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                CATEGORY_COLORS[s.tag.category] || "bg-muted",
              )}
            >
              {s.tag.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {Math.round(s.confidence * 100)}%
            </span>
            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleReview(s, "accept")}
                className="p-1 rounded hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/30 transition-colors"
                title="Accept suggestion"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleReview(s, "reject")}
                className="p-1 rounded hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 transition-colors"
                title="Reject suggestion"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
