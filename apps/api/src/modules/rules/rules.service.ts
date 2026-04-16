/**
 * Assignment Rules — Service Layer
 *
 * CRUD operations for admin-configured assignment rules.
 * Rules define how tickets are automatically assigned to agents
 * based on AI-applied tags.
 */

import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/index.js";
import type { z } from "zod";
import type {
  createRuleSchema,
  updateRuleSchema,
  reorderRulesSchema,
} from "./rules.validation.js";

type CreateRuleInput = z.infer<typeof createRuleSchema>;
type UpdateRuleInput = z.infer<typeof updateRuleSchema>;
type ReorderRulesInput = z.infer<typeof reorderRulesSchema>;

/**
 * List all assignment rules for a workspace, ordered by priority.
 */
export async function listRules(workspaceId: string) {
  return prisma.assignmentRule.findMany({
    where: { workspaceId },
    orderBy: { priority: "asc" },
    include: {
      assignee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
}

/**
 * Get a single rule by ID.
 */
export async function getRule(id: string, workspaceId: string) {
  const rule = await prisma.assignmentRule.findUnique({
    where: { id },
    include: {
      assignee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!rule || rule.workspaceId !== workspaceId) {
    throw AppError.notFound("Assignment rule not found");
  }

  return rule;
}

/**
 * Create a new assignment rule.
 * Automatically assigns the next priority (appended at end).
 */
export async function createRule(data: CreateRuleInput, workspaceId: string) {
  // Get the current max priority to append at the end
  const lastRule = await prisma.assignmentRule.findFirst({
    where: { workspaceId },
    orderBy: { priority: "desc" },
    select: { priority: true },
  });
  const nextPriority = (lastRule?.priority ?? -1) + 1;

  return prisma.assignmentRule.create({
    data: {
      name: data.name,
      priority: nextPriority,
      conditions: data.conditions as object,
      assigneeId: data.assigneeId ?? null,
      strategy: data.strategy,
      setPriority: data.setPriority ?? null,
      flagUrgent: data.flagUrgent,
      workspaceId,
    },
    include: {
      assignee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
}

/**
 * Update an existing rule.
 */
export async function updateRule(
  id: string,
  data: UpdateRuleInput,
  workspaceId: string,
) {
  const rule = await prisma.assignmentRule.findUnique({ where: { id } });

  if (!rule || rule.workspaceId !== workspaceId) {
    throw AppError.notFound("Assignment rule not found");
  }

  return prisma.assignmentRule.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.conditions !== undefined && {
        conditions: data.conditions as object,
      }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
      ...(data.strategy !== undefined && { strategy: data.strategy }),
      ...(data.setPriority !== undefined && { setPriority: data.setPriority }),
      ...(data.flagUrgent !== undefined && { flagUrgent: data.flagUrgent }),
    },
    include: {
      assignee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
}

/**
 * Reorder rules — bulk update priorities.
 */
export async function reorderRules(
  data: ReorderRulesInput,
  workspaceId: string,
) {
  const operations = data.rules.map((item) =>
    prisma.assignmentRule.update({
      where: { id: item.id },
      data: { priority: item.priority },
    }),
  );

  await prisma.$transaction(operations);

  return listRules(workspaceId);
}

/**
 * Toggle a rule on/off.
 */
export async function toggleRule(
  id: string,
  isEnabled: boolean,
  workspaceId: string,
) {
  const rule = await prisma.assignmentRule.findUnique({ where: { id } });

  if (!rule || rule.workspaceId !== workspaceId) {
    throw AppError.notFound("Assignment rule not found");
  }

  return prisma.assignmentRule.update({
    where: { id },
    data: { isEnabled },
    include: {
      assignee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
}

/**
 * Delete a rule.
 */
export async function deleteRule(id: string, workspaceId: string) {
  const rule = await prisma.assignmentRule.findUnique({ where: { id } });

  if (!rule || rule.workspaceId !== workspaceId) {
    throw AppError.notFound("Assignment rule not found");
  }

  await prisma.assignmentRule.delete({ where: { id } });
  return { message: "Rule deleted successfully" };
}
