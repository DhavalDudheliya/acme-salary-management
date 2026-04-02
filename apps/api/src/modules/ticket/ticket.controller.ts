import { Request, Response, NextFunction } from "express";
import * as ticketService from "./ticket.service.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";
import {
  createTicketSchema,
  updateTicketSchema,
  addCommentSchema,
  listTicketsQuerySchema,
} from "./ticket.validation.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = createTicketSchema.parse(req.body);
    const ticket = await ticketService.createTicket(
      data,
      authReq.user!.workspaceId,
    );
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const query = listTicketsQuerySchema.parse(req.query);
    const result = await ticketService.listTickets(
      authReq.user!.workspaceId,
      query,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const ticket = await ticketService.getTicket(
      req.params.id as string,
      authReq.user!.workspaceId,
    );
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = updateTicketSchema.parse(req.body);
    const ticket = await ticketService.updateTicket(
      req.params.id as string,
      data,
      authReq.user!.workspaceId,
    );
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await ticketService.deleteTicket(
      req.params.id as string,
      authReq.user!.workspaceId,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = addCommentSchema.parse(req.body);
    const comment = await ticketService.addComment(
      req.params.id as string,
      data,
      authReq.user!.userId,
      authReq.user!.workspaceId,
    );
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}
