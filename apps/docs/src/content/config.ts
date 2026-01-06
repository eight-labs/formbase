import { defineCollection, z } from 'astro:content';

export const TypeEnum = z.enum(['base', 'database']);

export const ServiceName = z.enum([
  'base',
  'Getting Started',
  'Form Integration',
  'CMS Platforms',
  'File Uploads',
  'Redirects',
  'Managing Submissions',
  'Form Settings',
  'Security',
  'Self-Hosting',
  'FAQ',
]);

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

const FormIntegration = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('Form Integration').default('Form Integration'),
  }),
});

const CMSPlatforms = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('CMS Platforms').default('CMS Platforms'),
  }),
});

const FileUploads = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('File Uploads').default('File Uploads'),
  }),
});

const Redirects = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('Redirects').default('Redirects'),
  }),
});

const ManagingSubmissions = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('Managing Submissions').default('Managing Submissions'),
  }),
});

const FormSettings = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('Form Settings').default('Form Settings'),
  }),
});

const Security = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('Security').default('Security'),
  }),
});

const SelfHosting = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('Self-Hosting').default('Self-Hosting'),
  }),
});

const FAQ = defineCollection({
  type: 'content',
  schema: baseSchema.extend({
    name: z.literal('FAQ').default('FAQ'),
  }),
});

export const collections = {
  'getting-started': GettingStarted,
  'form-integration': FormIntegration,
  'cms-platforms': CMSPlatforms,
  'file-uploads': FileUploads,
  redirects: Redirects,
  'managing-submissions': ManagingSubmissions,
  'form-settings': FormSettings,
  security: Security,
  'self-hosting': SelfHosting,
  faq: FAQ,
};
