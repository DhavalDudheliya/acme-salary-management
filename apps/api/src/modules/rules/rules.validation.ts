import { z } from "zod";

const conditionSchema = z.object({
  category: z.enum([
    "ISSUE_TYPE",
    "DEPARTMENT",
    "PRODUCT_AREA",
    "SENTIMENT",
    "SLA",
  ]),
  tagName: z.string().min(1),
});

const conditionsSchema = z.object({
  operator: z.enum(["AND", "OR"]),
  conditions: z
    .array(conditionSchema)
    .min(1, "At least one condition required"),
});

export const createRuleSchema = z.object({
  name: z.string().trim().min(1, "Rule name is required"),
  conditions: conditionsSchema,
  assigneeId: z.string().uuid().nullable().optional(),
  strategy: z.enum(["SPECIFIC", "ROUND_ROBIN"]).optional().default("SPECIFIC"),
  setPriority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .nullable()
    .optional(),
  flagUrgent: z.boolean().optional().default(false),
});

export const updateRuleSchema = z.object({
  name: z.string().trim().min(1).optional(),
  conditions: conditionsSchema.optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  strategy: z.enum(["SPECIFIC", "ROUND_ROBIN"]).optional(),
  setPriority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .nullable()
    .optional(),
  flagUrgent: z.boolean().optional(),
});

export const reorderRulesSchema = z.object({
  rules: z
    .array(
      z.object({
        id: z.string().uuid(),
        priority: z.number().int().min(0),
      }),
    )
    .min(1),
});

export const toggleRuleSchema = z.object({
  isEnabled: z.boolean(),
});

export const listAILogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(25),
  ruleId: z.string().uuid().optional(),
});
