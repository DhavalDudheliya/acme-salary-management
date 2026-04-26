import React from "react";
import { Brain } from "lucide-react";

export function AILogsEmpty() {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-xl">
      <Brain className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
      <p className="text-sm font-medium text-muted-foreground">
        No AI decisions yet
      </p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        Decisions will appear here once tickets are processed by the AI
      </p>
    </div>
  );
}
