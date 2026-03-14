import { z } from "zod";
import {
  inviteAgentSchema,
  acceptInvitationSchema,
} from "./invitation.validation.js";

export type InviteAgentInput = z.infer<typeof inviteAgentSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
