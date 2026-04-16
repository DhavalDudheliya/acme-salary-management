import React, { useState } from "react";
import { X, Zap, Users } from "lucide-react";
import { cn } from "@supporthub/ui/lib/utils";
import {
  rulesService,
  type AssignmentRule,
  type RuleConditions,
  type RuleCondition,
} from "@/lib/services/automation.service";
import {
  TAG_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type Agent,
} from "./constants";

import { Button } from "@supporthub/ui/components/button";
import { Input } from "@supporthub/ui/components/input";
import { Label } from "@supporthub/ui/components/label";
import { Checkbox } from "@supporthub/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@supporthub/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@supporthub/ui/components/select";

export function RuleFormModal({
  rule,
  agents,
  onClose,
  onSave,
}: {
  rule: AssignmentRule | null;
  agents: Agent[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(rule?.name || "");
  const [operator, setOperator] = useState<"AND" | "OR">(
    (rule?.conditions as RuleConditions)?.operator || "OR",
  );
  const [conditions, setConditions] = useState<RuleCondition[]>(
    (rule?.conditions as RuleConditions)?.conditions || [],
  );
  const [strategy, setStrategy] = useState<"SPECIFIC" | "ROUND_ROBIN">(
    rule?.strategy || "SPECIFIC",
  );
  const [assigneeId, setAssigneeId] = useState<string | null>(
    rule?.assigneeId || null,
  );
  const [setPriority, setSetPriority] = useState<string | null>(
    rule?.setPriority || null,
  );
  const [flagUrgent, setFlagUrgent] = useState(rule?.flagUrgent || false);
  const [saving, setSaving] = useState(false);
  const [condCategory, setCondCategory] = useState("");
  const [condTag, setCondTag] = useState("");

  const addCondition = () => {
    if (condCategory && condTag) {
      setConditions([
        ...conditions,
        { category: condCategory, tagName: condTag },
      ]);
      setCondCategory("");
      setCondTag("");
    }
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || conditions.length === 0) return;

    setSaving(true);
    try {
      const data = {
        name,
        conditions: { operator, conditions },
        strategy,
        assigneeId: strategy === "SPECIFIC" ? assigneeId : null,
        setPriority,
        flagUrgent,
        isEnabled: true,
      };

      if (rule) {
        await rulesService.update(rule.id, data);
      } else {
        await rulesService.create(data);
      }

      onSave();
    } catch (err) {
      console.error("Failed to save rule:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Rule" : "Create Rule"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Rule name */}
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "Billing tickets to billing team"'
              required
            />
          </div>

          {/* Conditions */}
          <div className="space-y-3">
            <Label>Conditions</Label>

            {/* Operator toggle */}
            <div className="flex gap-2 items-center mb-3">
              {(["AND", "OR"] as const).map((op) => {
                const handleSelectOperator = () => setOperator(op);

                return (
                  <Button
                    key={op}
                    type="button"
                    variant={operator === op ? "default" : "outline"}
                    size="sm"
                    onClick={handleSelectOperator}
                  >
                    {op}
                  </Button>
                );
              })}
              <span className="text-xs text-muted-foreground ml-1">
                {operator === "AND"
                  ? "All conditions must match"
                  : "Any condition can match"}
              </span>
            </div>

            {/* Existing conditions */}
            <div className="space-y-2 mb-4">
              {conditions.map((c, i) => {
                const handleRemoveClick = () => removeCondition(i);

                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs border rounded-md px-3 py-2 bg-muted/30"
                  >
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full font-medium whitespace-nowrap",
                        CATEGORY_COLORS[c.category] || "bg-muted",
                      )}
                    >
                      {CATEGORY_LABELS[c.category] || c.category}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium truncate">{c.tagName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleRemoveClick}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Add condition */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={condCategory}
                  onValueChange={(v) => {
                    setCondCategory(v || "");
                    setCondTag("");
                  }}
                >
                  <SelectTrigger aria-label="Select Category">
                    <SelectValue placeholder="Category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(TAG_CATEGORIES).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  disabled={!condCategory}
                  value={condTag}
                  onValueChange={(v) => setCondTag(v || "")}
                >
                  <SelectTrigger aria-label="Select Tag">
                    <SelectValue placeholder="Tag..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(TAG_CATEGORIES[condCategory] || []).map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={addCondition}
                disabled={!condCategory || !condTag}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Assignment strategy */}
          <div className="space-y-3">
            <Label>Assign To</Label>
            <div className="flex gap-2 mb-3">
              {(["SPECIFIC", "ROUND_ROBIN"] as const).map((s) => {
                const handleSelectStrategy = () => setStrategy(s);

                return (
                  <Button
                    key={s}
                    type="button"
                    variant={strategy === s ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={handleSelectStrategy}
                  >
                    {s === "SPECIFIC" ? (
                      <Zap className="h-3 w-3" />
                    ) : (
                      <Users className="h-3 w-3" />
                    )}
                    {s === "SPECIFIC" ? "Specific Agent" : "Round Robin"}
                  </Button>
                );
              })}
            </div>

            {strategy === "SPECIFIC" && (
              <Select
                value={assigneeId || "NONE"}
                onValueChange={(v) =>
                  setAssigneeId(v === "NONE" || !v ? null : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"NONE"}>Select agent...</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.firstName} {a.lastName} — {a.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Optional overrides */}
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Override Priority</Label>
              <Select
                value={setPriority || "NONE"}
                onValueChange={(v) =>
                  setSetPriority(v === "NONE" || !v ? null : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No override" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No override</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pb-2">
              <Checkbox
                id="flag-urgent"
                checked={flagUrgent}
                onCheckedChange={(c) => setFlagUrgent(c === true)}
              />
              <Label
                htmlFor="flag-urgent"
                className="cursor-pointer font-normal"
              >
                Flag urgent
              </Label>
            </div>
          </div>

          {/* Actions */}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !name.trim() || conditions.length === 0}
            >
              {saving ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
