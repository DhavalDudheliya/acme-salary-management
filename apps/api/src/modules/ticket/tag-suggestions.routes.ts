/**
 * Tag Suggestions — Controller
 *
 * Endpoints for agents to view and act on AI-suggested tags.
 * When the AI's confidence is below 70%, tags are shown as suggestions
 * for the agent to accept or reject with one click.
 */

import { Router, type IRouter, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";
import prisma from "../../lib/prisma.js";

const router: IRouter = Router();

router.use(authMiddleware);

const actionSchema = z.object({
  action: z.enum(["accept", "reject"]),
});

/** Get all pending tag suggestions for a ticket */
router.get("/:id/suggestions", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const ticketId = req.params.id as string;

  // Verify ticket belongs to this workspace
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { workspaceId: true },
  });

  if (!ticket || ticket.workspaceId !== authReq.user!.workspaceId) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }

  const suggestions = await prisma.tagSuggestion.findMany({
    where: { ticketId },
    include: {
      tag: {
        select: { id: true, name: true, category: true },
      },
    },
    orderBy: { confidence: "desc" },
  });

  res.status(200).json(suggestions);
});

/** Accept or reject a tag suggestion */
router.patch(
  "/:id/suggestions/:suggestionId",
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { id: ticketId, suggestionId } = req.params as {
      id: string;
      suggestionId: string;
    };
    const { action } = actionSchema.parse(req.body);

    // Verify suggestion exists and belongs to the right workspace
    const suggestion = await prisma.tagSuggestion.findUnique({
      where: { id: suggestionId },
      include: {
        ticket: { select: { workspaceId: true } },
        tag: { select: { id: true, name: true, category: true } },
      },
    });

    if (
      !suggestion ||
      suggestion.ticketId !== ticketId ||
      suggestion.ticket.workspaceId !== authReq.user!.workspaceId
    ) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }

    if (suggestion.status !== "PENDING") {
      res.status(400).json({ message: "Suggestion has already been reviewed" });
      return;
    }

    if (action === "accept") {
      // Accept: connect the tag to the ticket + update suggestion status
      await prisma.$transaction([
        prisma.ticket.update({
          where: { id: ticketId },
          data: {
            tags: { connect: { id: suggestion.tagId } },
          },
        }),
        prisma.tagSuggestion.update({
          where: { id: suggestionId },
          data: {
            status: "ACCEPTED",
            reviewedBy: authReq.user!.userId,
          },
        }),
      ]);
    } else {
      // Reject: just update the suggestion status
      await prisma.tagSuggestion.update({
        where: { id: suggestionId },
        data: {
          status: "REJECTED",
          reviewedBy: authReq.user!.userId,
        },
      });
    }

    const updated = await prisma.tagSuggestion.findUnique({
      where: { id: suggestionId },
      include: {
        tag: { select: { id: true, name: true, category: true } },
      },
    });

    res.status(200).json(updated);
  },
);

export default router;
