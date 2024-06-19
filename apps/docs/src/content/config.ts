import { defineCollection, z } from 'astro:content';

export const TypeEnum = z.enum(['base', 'database']);

export const ServiceName = z.enum(['base', 'Getting Started']);

const baseSchema = z.object({
  type: z.literal('base').optional().default('base'),
  name: ServiceName.optional().default('base'),
  shortTitle: z.string(),
  order: z.number().optional().default(Infinity),
  title: z.string(),
  description: z.string(),
  lastModifiedAt: z.coerce.date().optional(),
  publishedAt: z.coerce.date(),
});

const GettingStarted = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    type: z.literal(TypeEnum.enum.database).default(TypeEnum.enum.database),
    name: z.literal('Getting Started').default('Getting Started'),
  }),
});

export const collections = {
  'getting-started': GettingStarted,
};
