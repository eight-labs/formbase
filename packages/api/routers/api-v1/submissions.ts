import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { drizzlePrimitives } from '@formbase/db';
import { formDatas } from '@formbase/db/schema';

const { and, eq, gte, inArray, lte } = drizzlePrimitives;

import { parseJsonObject } from '../../utils/json';
import {
  bulkDeleteInputSchema,
  dateRangeInputSchema,
  paginationInputSchema,
  paginationOutputSchema,
} from './schemas';
import { apiKeyProcedure, createApiV1Router } from './trpc';

async function assertApiFormOwnership(
  ctx: { db: any; user: { id: string } },
  formId: string,
) {
  const form = await ctx.db.query.forms.findFirst({
    where: (table: any) =>
      and(eq(table.id, formId), eq(table.userId, ctx.user.id)),
  });

  if (!form) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Form not found',
    });
  }

  return form;
}

async function assertApiSubmissionOwnership(
  ctx: { db: any; user: { id: string } },
  formId: string,
  submissionId: string,
) {
  await assertApiFormOwnership(ctx, formId);

  const submission = await ctx.db.query.formDatas.findFirst({
    where: (table: any) =>
      and(eq(table.id, submissionId), eq(table.formId, formId)),
  });

  if (!submission) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Submission not found',
    });
  }

  return submission;
}

export const submissionsRouter = createApiV1Router({
  list: apiKeyProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/{formId}/submissions',
        tags: ['Submissions'],
        summary: 'List submissions for a form',
        description: 'Returns a paginated list of submissions with optional date filtering.',
      },
    })
    .input(
      paginationInputSchema.merge(dateRangeInputSchema).extend({
        formId: z.string(),
      }),
    )
    .output(
      z.object({
        submissions: z.array(
          z.object({
            id: z.string(),
            formId: z.string(),
            data: z.record(z.unknown()),
            createdAt: z.string(),
          }),
        ),
        pagination: paginationOutputSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertApiFormOwnership(ctx, input.formId);

      const offset = (input.page - 1) * input.perPage;

      const whereConditions: any[] = [eq(formDatas.formId, input.formId)];

      if (input.startDate) {
        whereConditions.push(gte(formDatas.createdAt, new Date(input.startDate)));
      }
      if (input.endDate) {
        const endDate = new Date(input.endDate);
        endDate.setHours(23, 59, 59, 999);
        whereConditions.push(lte(formDatas.createdAt, endDate));
      }

      const whereClause = and(...whereConditions);

      const [submissionsList, totalResult] = await Promise.all([
        ctx.db.query.formDatas.findMany({
          where: () => whereClause,
          offset,
          limit: input.perPage,
          orderBy: (table: any, { desc }: any) => desc(table.createdAt),
        }),
        ctx.db
          .select({ count: formDatas.id })
          .from(formDatas)
          .where(whereClause),
      ]);

      const total = totalResult.length;

      return {
        submissions: submissionsList.map((submission: any) => ({
          id: submission.id,
          formId: submission.formId,
          data: parseJsonObject(submission.data) ?? {},
          createdAt: submission.createdAt.toISOString(),
        })),
        pagination: {
          page: input.page,
          perPage: input.perPage,
          total,
          totalPages: Math.ceil(total / input.perPage),
        },
      };
    }),

  get: apiKeyProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/{formId}/submissions/{submissionId}',
        tags: ['Submissions'],
        summary: 'Get a single submission',
      },
    })
    .input(
      z.object({
        formId: z.string(),
        submissionId: z.string(),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        formId: z.string(),
        data: z.record(z.unknown()),
        createdAt: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const submission = await assertApiSubmissionOwnership(
        ctx,
        input.formId,
        input.submissionId,
      );

      return {
        id: submission.id,
        formId: submission.formId,
        data: parseJsonObject(submission.data) ?? {},
        createdAt: submission.createdAt.toISOString(),
      };
    }),

  delete: apiKeyProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/forms/{formId}/submissions/{submissionId}',
        tags: ['Submissions'],
        summary: 'Delete a submission',
      },
    })
    .input(
      z.object({
        formId: z.string(),
        submissionId: z.string(),
      }),
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await assertApiSubmissionOwnership(ctx, input.formId, input.submissionId);

      await ctx.db
        .delete(formDatas)
        .where(eq(formDatas.id, input.submissionId));

      return { success: true };
    }),

  bulkDelete: apiKeyProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/forms/{formId}/submissions/bulk',
        tags: ['Submissions'],
        summary: 'Delete multiple submissions',
      },
    })
    .input(
      bulkDeleteInputSchema.extend({
        formId: z.string(),
      }),
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await assertApiFormOwnership(ctx, input.formId);

      const submissions = await ctx.db.query.formDatas.findMany({
        where: (table: any) =>
          and(
            inArray(table.id, input.ids),
            eq(table.formId, input.formId),
          ),
      });

      const foundIds = submissions.map((s: any) => s.id);
      const notFound = input.ids.filter((id) => !foundIds.includes(id));

      if (notFound.length > 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Submissions not found: ${notFound.join(', ')}`,
        });
      }

      await ctx.db.delete(formDatas).where(inArray(formDatas.id, input.ids));

      return { success: true };
    }),
});
