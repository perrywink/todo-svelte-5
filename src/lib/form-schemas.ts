import { z } from "zod";

// Define outside the load function so the adapter can be cached
export const createSchema = z.object({
  description: z.string().min(1),
});

export const updateSchema = z.object({
  id: z.number(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});