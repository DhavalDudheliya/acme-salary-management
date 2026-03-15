import prisma from "../../lib/prisma.js";
import { InviteAgentInput, AcceptInvitationInput } from "./invitation.types.js";
import { randomBytes } from "crypto";
import { hashPassword } from "../../utils/password.js";
// Import email service when ready
// import { sendEmail } from "../../services/email.service";

export async function createInvitation(
  data: InviteAgentInput,
  workspaceId: string,
  inviterId: string,
) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    if (existingUser.workspaceId === workspaceId) {
      throw {
        status: 400,
        message: "User is already an agent in this workspace",
      };
    } else {
      throw {
        status: 400,
        message: "User is already registered with another workspace",
      };
    }
  }

  // Check if invitation already exists and is pending
  const existingInv = await prisma.invitation.findUnique({
    where: {
      email_workspaceId: { email: data.email, workspaceId },
    },
  });

  if (
    existingInv &&
    existingInv.status === "PENDING" &&
    existingInv.expiresAt > new Date()
  ) {
    throw {
      status: 400,
      message: "An active invitation already exists for this email",
    };
  }

  // Generate a random token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

  const invitation = await prisma.invitation.upsert({
    where: {
      email_workspaceId: { email: data.email, workspaceId },
    },
    update: {
      token,
      expiresAt,
      status: "PENDING",
      invitedBy: inviterId,
    },
    create: {
      email: data.email,
      token,
      expiresAt,
      workspaceId,
      invitedBy: inviterId,
    },
    include: {
      workspace: true,
      inviter: true,
    },
  });

  // TODO: Actually send the email using an email service
  console.log(`[EMAIL SIMULATION] Sending invitation email to ${data.email}.`);
  console.log(
    `[EMAIL SIMULATION] Link: http://localhost:3000/tenant/accept-invite?token=${token}`,
  );

  return invitation;
}

export async function getPendingInvitations(workspaceId: string) {
  return await prisma.invitation.findMany({
    where: {
      workspaceId,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function revokeInvitation(
  invitationId: string,
  workspaceId: string,
) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation || invitation.workspaceId !== workspaceId) {
    throw { status: 404, message: "Invitation not found" };
  }

  if (invitation.status !== "PENDING") {
    throw { status: 400, message: "Only pending invitations can be revoked" };
  }

  await prisma.invitation.delete({
    where: { id: invitationId },
  });

  return { message: "Invitation revoked successfully" };
}

export async function acceptInvitation(data: AcceptInvitationInput) {
  // Create the user
  const passwordHash = await hashPassword(data.password);

  try {
    const user = await prisma.$transaction(async (tx: any) => {
      // 1. Double check invitation status atomically inside transaction
      const invitation = await tx.invitation.findUnique({
        where: { token: data.token },
      });

      if (!invitation || invitation.status !== "PENDING") {
        throw {
          status: 400,
          message: "Invitation has already been accepted or is no longer valid",
        };
      }

      if (invitation.expiresAt < new Date()) {
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { status: "EXPIRED" },
        });
        throw { status: 400, message: "Invitation has expired" };
      }

      // 2. Create user
      const newUser = await tx.user.create({
        data: {
          email: invitation.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: "",
          passwordHash,
          role: "AGENT",
          workspaceId: invitation.workspaceId,
          isEmailVerified: true, // Auto-verify since they received the invite email
        },
      });

      // 3. Mark invitation as accepted
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      return newUser;
    });

    return user;
  } catch (error: any) {
    // Catch unique constraint violation (P2002) for user email
    if (error.code === "P2002") {
      throw {
        status: 409,
        message: "A user with this email address already exists.",
      };
    }
    throw error;
  }
}
