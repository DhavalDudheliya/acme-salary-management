import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";

export function AssignmentRulesHeader({
  onNewRule,
}: {
  onNewRule: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Assignment Rules
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rules are evaluated in order — the first matching rule assigns the
          ticket. Drag to reorder.
        </p>
      </div>
      <Button onClick={onNewRule} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Rule
      </Button>
    </div>
  );
}
