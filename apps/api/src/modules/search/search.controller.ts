import { Request, Response } from "express";
import { AuthenticatedRequest } from "../auth/auth.types.js";
import * as searchService from "./search.service.js";
import { searchQuerySchema } from "./search.validation.js";

export async function search(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const { q, limit } = searchQuerySchema.parse(req.query);

  const tickets = await searchService.searchTickets(
    authReq.user!.workspaceId,
    q,
    limit,
  );

  res.status(200).json({ tickets });
}
