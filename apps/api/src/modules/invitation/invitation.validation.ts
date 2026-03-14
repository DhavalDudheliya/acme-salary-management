import { z } from "zod";

export const inviteAgentSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
