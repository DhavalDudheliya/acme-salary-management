import { z } from "zod";

export const createCustomerSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
});

export const updateCustomerSchema = z.object({
  email: z.string().email("Please provide a valid email address").optional(),
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().optional(),
});
