/**
 * AI Decision Logs — Controller & Routes
 *
 * Admin-only endpoints for viewing the AI classification audit trail.
 */

import { Router, type IRouter, Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";
import { listAILogsQuerySchema } from "./rules.validation.js";
import prisma from "../../lib/prisma.js";

const router: IRouter = Router();

router.use(authMiddleware);
router.use(adminOnly);

/** List AI decision logs (paginated) */
router.get("/", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const query = listAILogsQuerySchema.parse(req.query);
  const { page, limit, ruleId } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    workspaceId: authReq.user!.workspaceId,
  };
  if (ruleId) where.ruleId = ruleId;

  const [logs, total] = await Promise.all([
    prisma.aIDecisionLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            subject: true,
          },
        },
      },
    }),
    prisma.aIDecisionLog.count({ where }),
  ]);

  res.status(200).json({ logs, total, page, limit });
});

/** Get a single AI decision log with full detail */
router.get("/:id", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const log = await prisma.aIDecisionLog.findUnique({
    where: { id: req.params.id as string },
    include: {
      ticket: {
        select: {
          id: true,
          ticketNumber: true,
          subject: true,
          status: true,
          priority: true,
        },
      },
    },
  });

  if (!log || log.workspaceId !== authReq.user!.workspaceId) {
    res.status(404).json({ message: "AI decision log not found" });
    return;
  }

  res.status(200).json(log);
});

export default router;
