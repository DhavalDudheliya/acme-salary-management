import { z } from "zod";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.validation.js";

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
