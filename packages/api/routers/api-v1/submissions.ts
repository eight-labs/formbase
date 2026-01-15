import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { drizzlePrimitives } from '@formbase/db';
import { formDatas } from '@formbase/db/schema';

import { parseJsonObject } from '../../utils/json';
import {
  assertApiFormOwnership,
  assertApiSubmissionOwnership,
} from './ownership';
import {
  bulkDeleteInputSchema,
  dateRangeInputSchema,
  paginationInputSchema,
  paginationOutputSchema,
  submissionSchema,
} from './schemas';
import { apiKeyProcedure, createApiV1Router } from './trpc';

const { and, count, eq, gte, inArray, lte } = drizzlePrimitives;

export const submissionsRouter = createApiV1Router({
  list: apiKeyProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/{formId}/submissions',
        tags: ['Submissions'],
        summary: 'List submissions for a form',
        description: 'Returns a paginated list of submissions with optional date and spam filtering.',
      },
    })
    .input(
      paginationInputSchema.merge(dateRangeInputSchema).extend({
        formId: z.string(),
        spam: z.enum(['true', 'false']).optional(),
      }),
    )
    .output(
      z.object({
        submissions: z.array(submissionSchema),
        pagination: paginationOutputSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertApiFormOwnership(ctx, input.formId);

      const offset = (input.page - 1) * input.perPage;

      const whereConditions = [eq(formDatas.formId, input.formId)];

      if (input.startDate) {
        whereConditions.push(gte(formDatas.createdAt, new Date(input.startDate)));
      }
      if (input.endDate) {
        const endDate = new Date(input.endDate);
        endDate.setHours(23, 59, 59, 999);
        whereConditions.push(lte(formDatas.createdAt, endDate));
      }
      if (input.spam !== undefined) {
        whereConditions.push(eq(formDatas.isSpam, input.spam === 'true'));
      }

      const whereClause = and(...whereConditions);

      const [submissionsList, totalResult] = await Promise.all([
        ctx.db.query.formDatas.findMany({
          where: () => whereClause,
          offset,
          limit: input.perPage,
          orderBy: (table, { desc }) => desc(table.createdAt),
        }),
        ctx.db
          .select({ count: count() })
          .from(formDatas)
          .where(whereClause),
      ]);

      const total = totalResult[0]?.count ?? 0;

      return {
        submissions: submissionsList.map((submission) => ({
          id: submission.id,
          formId: submission.formId,
          data: parseJsonObject(submission.data) ?? {},
          createdAt: submission.createdAt.toISOString(),
          isSpam: submission.isSpam,
          spamReason: submission.spamReason,
          manualOverride: submission.manualOverride,
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
    .output(submissionSchema)
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
        isSpam: submission.isSpam,
        spamReason: submission.spamReason,
        manualOverride: submission.manualOverride,
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
        where: (table) =>
          and(
            inArray(table.id, input.ids),
            eq(table.formId, input.formId),
          ),
      });

      const foundIds = submissions.map((s) => s.id);
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
