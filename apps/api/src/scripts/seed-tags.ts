/**
 * Seed Tags — Predefined System Tags
 *
 * Creates the 27 predefined tags across 5 categories for a workspace.
 * Tags are marked as isSystem: true so they cannot be deleted by admins.
 *
 * This module exports a reusable function that can be called:
 * 1. As a standalone script for existing workspaces
 * 2. During workspace creation to bootstrap the tag library
 *
 * Usage (standalone): npx tsx src/scripts/seed-tags.ts <workspaceId>
 */

import prisma from "../lib/prisma.js";
import type { TagCategory } from "../../generated/prisma/client.js";

/** The full predefined tag vocabulary grouped by category */
export const SYSTEM_TAGS: Record<string, string[]> = {
  ISSUE_TYPE: [
    "Bug",
    "Feature request",
    "Question",
    "Complaint",
    "Billing issue",
    "Refund request",
    "Account access",
    "Onboarding",
  ],
  DEPARTMENT: [
    "Billing",
    "Technical support",
    "Sales",
    "Legal",
    "Compliance",
    "Enterprise",
  ],
  PRODUCT_AREA: [
    "Mobile app",
    "Web app",
    "API",
    "Integrations",
    "Dashboard",
    "Payments",
  ],
  SENTIMENT: ["Angry", "Frustrated", "Neutral", "Satisfied", "Urgent tone"],
  SLA: ["SLA breach risk", "VIP customer", "First response due"],
};

/**
 * Seed all predefined system tags for a workspace.
 * Uses upsert to be idempotent — safe to run multiple times.
 */
export async function seedSystemTags(workspaceId: string): Promise<void> {
  const operations = [];

  for (const [category, tagNames] of Object.entries(SYSTEM_TAGS)) {
    for (const name of tagNames) {
      operations.push(
        prisma.tag.upsert({
          where: {
            name_category_workspaceId: {
              name,
              category: category as TagCategory,
              workspaceId,
            },
          },
          update: {}, // No changes if already exists
          create: {
            name,
            category: category as TagCategory,
            isSystem: true,
            workspaceId,
          },
        }),
      );
    }
  }

  await prisma.$transaction(operations);
}

// --- Standalone execution ---
const args = process.argv.slice(2);
if (args.length > 0) {
  const workspaceId = args[0]!;
  console.log(`Seeding system tags for workspace: ${workspaceId}`);
  seedSystemTags(workspaceId)
    .then(() => console.log("✅ System tags seeded successfully"))
    .catch((err) => {
      console.error("❌ Failed to seed tags:", err);
      process.exit(1);
    });
}
