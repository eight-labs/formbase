import { z } from "zod";

export const CreateFormInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  enableEmailNotifications: z.boolean().default(true),
  returnUrl: z.string().url().optional(),
});

export const UpdateFormInputSchema = CreateFormInputSchema.partial();
