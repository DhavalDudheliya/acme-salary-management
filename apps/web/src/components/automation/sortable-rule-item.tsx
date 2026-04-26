import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  ChevronRight,
  Users,
} from "lucide-react";
import { cn } from "@supporthub/ui/lib/utils";
import { Button } from "@supporthub/ui/components/button";
import { Switch } from "@supporthub/ui/components/switch";
import {
  type AssignmentRule,
  type RuleConditions,
  type RuleCondition,
} from "@/lib/services/automation.service";
import { CATEGORY_COLORS } from "./constants";

export function SortableRuleItem({
  rule,
  onEdit,
  onDelete,
  onToggle,
}: {
  rule: AssignmentRule;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const conditions = rule.conditions as RuleConditions;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 rounded-lg border bg-background p-4 transition-all",
        isDragging ? "shadow-lg ring-2 ring-primary/20 z-50" : "shadow-sm",
        !rule.isEnabled && "opacity-50",
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground p-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Rule content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-medium text-sm text-foreground truncate">
            {rule.name}
          </span>
          {rule.flagUrgent && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              Urgent
            </span>
          )}
        </div>

        {/* Conditions */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-medium">IF</span>
          {conditions.conditions.map((c: RuleCondition, i: number) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="text-muted-foreground font-semibold">
                  {conditions.operator}
                </span>
              )}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full font-medium",
                  CATEGORY_COLORS[c.category] ||
                    "bg-muted text-muted-foreground",
                )}
              >
                {c.tagName}
              </span>
            </React.Fragment>
          ))}
          <ChevronRight className="h-3 w-3 text-muted-foreground mx-1" />
          <span className="text-muted-foreground">
            {rule.strategy === "ROUND_ROBIN" ? (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> Round Robin
              </span>
            ) : rule.assignee ? (
              `${rule.assignee.firstName} ${rule.assignee.lastName}`
            ) : (
              "Unassigned"
            )}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Switch
          checked={rule.isEnabled}
          onCheckedChange={onToggle}
          aria-label="Toggle rule"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
