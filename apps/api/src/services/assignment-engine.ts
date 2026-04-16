/**
 * Assignment Rule Engine
 *
 * Evaluates admin-configured assignment rules against a ticket's tags
 * to determine which agent should be assigned.
 *
 * Rules are evaluated in priority order (lower = first). The first
 * matching rule wins. If no rule matches, returns null (ticket stays
 * in the unassigned queue).
 *
 * Supports:
 * - AND/OR condition operators
 * - SPECIFIC agent assignment
 * - ROUND_ROBIN distribution (assigns to agent with fewest open tickets)
 */

import prisma from "../lib/prisma.js";
import logger from "../lib/logger.js";
import type { TicketPriority } from "../../generated/prisma/client.js";

/** Shape of a single condition within a rule */
interface RuleCondition {
  category: string;
  tagName: string;
}

/** Shape of the conditions JSON stored in AssignmentRule */
interface RuleConditions {
  operator: "AND" | "OR";
  conditions: RuleCondition[];
}

/** Result of running the assignment engine */
export interface AssignmentResult {
  assigneeId: string;
  ruleId: string;
  ruleName: string;
  setPriority?: TicketPriority | null;
  flagUrgent: boolean;
}

/** Tag info used for matching */
interface TagInfo {
  name: string;
  category: string;
}

/**
 * Evaluate whether a set of tags matches a rule's conditions.
 */
function evaluateConditions(
  conditions: RuleConditions,
  ticketTags: TagInfo[],
): boolean {
  if (!conditions.conditions || conditions.conditions.length === 0) {
    return false;
  }

  const matchResults = conditions.conditions.map((cond) =>
    ticketTags.some(
      (tag) =>
        tag.category === cond.category &&
        tag.name.toLowerCase() === cond.tagName.toLowerCase(),
    ),
  );

  if (conditions.operator === "AND") {
    return matchResults.every(Boolean);
  }

  // OR
  return matchResults.some(Boolean);
}

/**
 * For ROUND_ROBIN strategy, find the agent in the workspace with
 * the fewest currently-open tickets.
 */
async function findLeastLoadedAgent(
  workspaceId: string,
): Promise<string | null> {
  // Get all agents (including admins) in the workspace
  const agents = await prisma.user.findMany({
    where: { workspaceId },
    select: {
      id: true,
      _count: {
        select: {
          assignedTickets: {
            where: {
              status: { in: ["OPEN", "PENDING"] },
            },
          },
        },
      },
    },
  });

  if (agents.length === 0) return null;

  // Sort by open ticket count ascending, pick the first
  agents.sort((a, b) => a._count.assignedTickets - b._count.assignedTickets);

  return agents[0]!.id;
}

/**
 * Run the assignment engine for a ticket.
 *
 * @param workspaceId - The workspace to find rules for
 * @param ticketTags  - The tags applied to the ticket (name + category)
 * @returns AssignmentResult if a rule matched, null otherwise
 */
export async function runAssignmentEngine(
  workspaceId: string,
  ticketTags: TagInfo[],
): Promise<AssignmentResult | null> {
  if (ticketTags.length === 0) {
    logger.info("No tags on ticket — skipping assignment rules");
    return null;
  }

  // Fetch all enabled rules for the workspace, ordered by priority
  const rules = await prisma.assignmentRule.findMany({
    where: {
      workspaceId,
      isEnabled: true,
    },
    orderBy: { priority: "asc" },
  });

  if (rules.length === 0) {
    logger.info({ workspaceId }, "No assignment rules configured");
    return null;
  }

  // Evaluate each rule in order — first match wins
  for (const rule of rules) {
    const conditions = rule.conditions as unknown as RuleConditions;

    if (!evaluateConditions(conditions, ticketTags)) {
      continue;
    }

    logger.info(
      { ruleId: rule.id, ruleName: rule.name },
      "Assignment rule matched",
    );

    // Determine assignee based on strategy
    let assigneeId: string | null = null;

    if (rule.strategy === "SPECIFIC" && rule.assigneeId) {
      assigneeId = rule.assigneeId;
    } else if (rule.strategy === "ROUND_ROBIN") {
      assigneeId = await findLeastLoadedAgent(workspaceId);
    }

    if (!assigneeId) {
      logger.warn(
        { ruleId: rule.id, strategy: rule.strategy },
        "Rule matched but no assignee could be determined",
      );
      continue; // Try next rule
    }

    return {
      assigneeId,
      ruleId: rule.id,
      ruleName: rule.name,
      setPriority: rule.setPriority,
      flagUrgent: rule.flagUrgent,
    };
  }

  logger.info(
    { workspaceId },
    "No assignment rule matched — ticket unassigned",
  );
  return null;
}
