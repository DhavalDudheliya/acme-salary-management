/**
 * Assignment Rules — Controller (Route Handlers)
 *
 * Thin controller layer for assignment rules CRUD.
 * Admin-only — enforced by the role middleware on the routes.
 */

import { Request, Response } from "express";
import * as rulesService from "./rules.service.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";
import {
  createRuleSchema,
  updateRuleSchema,
  reorderRulesSchema,
  toggleRuleSchema,
} from "./rules.validation.js";

export async function list(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const rules = await rulesService.listRules(authReq.user!.workspaceId);
  res.status(200).json(rules);
}

export async function get(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const rule = await rulesService.getRule(
    req.params.id as string,
    authReq.user!.workspaceId,
  );
  res.status(200).json(rule);
}

export async function create(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const data = createRuleSchema.parse(req.body);
  const rule = await rulesService.createRule(data, authReq.user!.workspaceId);
  res.status(201).json(rule);
}

export async function update(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const data = updateRuleSchema.parse(req.body);
  const rule = await rulesService.updateRule(
    req.params.id as string,
    data,
    authReq.user!.workspaceId,
  );
  res.status(200).json(rule);
}

export async function reorder(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const data = reorderRulesSchema.parse(req.body);
  const rules = await rulesService.reorderRules(
    data,
    authReq.user!.workspaceId,
  );
  res.status(200).json(rules);
}

export async function toggle(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const data = toggleRuleSchema.parse(req.body);
  const rule = await rulesService.toggleRule(
    req.params.id as string,
    data.isEnabled,
    authReq.user!.workspaceId,
  );
  res.status(200).json(rule);
}

export async function remove(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const result = await rulesService.deleteRule(
    req.params.id as string,
    authReq.user!.workspaceId,
  );
  res.status(200).json(result);
}
