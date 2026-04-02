import { z } from "zod";
import {
  createTicketSchema,
  updateTicketSchema,
  addCommentSchema,
  listTicketsQuerySchema,
} from "./ticket.validation.js";

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;
