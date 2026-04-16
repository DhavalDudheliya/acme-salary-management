import React from "react";
import { Zap } from "lucide-react";

export function AssignmentRulesEmpty() {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-xl">
      <Zap className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
      <p className="text-sm font-medium text-muted-foreground">
        No assignment rules yet
      </p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        Create a rule to automatically assign tickets to agents
      </p>
    </div>
  );
}
