import { Request, Response, NextFunction } from "express";
import * as invitationService from "./invitation.service.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";
import {
  acceptInvitationSchema,
  inviteAgentSchema,
} from "./invitation.validation.js";

export async function inviteAgent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authReq = req as AuthenticatedRequest;

    // Only admins can invite
    if (authReq.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Only admins can invite new agents" });
      return;
    }

    const data = inviteAgentSchema.parse(req.body);
    const invitation = await invitationService.createInvitation(
      data,
      authReq.user.workspaceId,
      authReq.user.userId,
    );

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvitations(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authReq = req as AuthenticatedRequest;

    // Only admins can view invitations
    if (authReq.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Only admins can view invitations" });
      return;
    }

    const invitations = await invitationService.getPendingInvitations(
      authReq.user.workspaceId,
    );

    res.status(200).json(invitations);
  } catch (error) {
    next(error);
  }
}

export async function revokeInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;

    // Only admins can revoke invitations
    if (authReq.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Only admins can revoke invitations" });
      return;
    }

    const result = await invitationService.revokeInvitation(
      id,
      authReq.user.workspaceId,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function acceptInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = acceptInvitationSchema.parse(req.body);
    const user = await invitationService.acceptInvitation(data);

    res.status(200).json({
      message: "Invitation accepted successfully",
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
}
