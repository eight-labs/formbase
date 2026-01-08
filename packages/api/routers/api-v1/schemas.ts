import { z } from 'zod';

export const paginationInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(20),
});

export const paginationOutputSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  returnUrl: z.string().nullable(),
  keys: z.array(z.string()),
  submissionCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export const submissionSchema = z.object({
  id: z.string(),
  formId: z.string(),
  data: z.record(z.unknown()),
  createdAt: z.string(),
});

export const errorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const createFormInputSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  returnUrl: z.string().url().optional(),
});

export const updateFormInputSchema = z.object({
  formId: z.string(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  returnUrl: z.string().url().optional(),
});

export const bulkCreateFormInputSchema = z.object({
  forms: z.array(createFormInputSchema),
});

export const bulkUpdateFormInputSchema = z.object({
  forms: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().max(1000).optional(),
      returnUrl: z.string().url().optional(),
    }),
  ),
});

export const bulkDeleteInputSchema = z.object({
  ids: z.array(z.string()),
});

export const dateRangeInputSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type PaginationInput = z.infer<typeof paginationInputSchema>;
export type FormOutput = z.infer<typeof formSchema>;
export type SubmissionOutput = z.infer<typeof submissionSchema>;
