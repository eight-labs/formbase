'use server';

import { generateId } from 'lucia';
import { createDate, TimeSpan } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';

import { db, drizzlePrimitives } from '@formbase/db';
import {
  emailVerificationCodes,
  passwordResetTokens,
} from '@formbase/db/schema';

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
}

export async function generateEmailVerificationCode(
  userId: string,
  email: string,
): Promise<string> {
  await db
    .delete(emailVerificationCodes)
    .where(drizzlePrimitives.eq(emailVerificationCodes.userId, userId));
  const code = generateRandomString(8, alphabet('0-9')); // 8 digit code
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
  });
  return code;
}

export async function generatePasswordResetToken(
  userId: string,
): Promise<string> {
  await db
    .delete(passwordResetTokens)
    .where(drizzlePrimitives.eq(passwordResetTokens.userId, userId));
  const tokenId = generateId(40);
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: createDate(new TimeSpan(2, 'h')),
  });
  return tokenId;
}
