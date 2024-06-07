'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { SignupInput } from '../validators/auth';
import type { ActionResponse } from './utils';

import { generateId, Scrypt } from 'lucia';

import { db } from '@formbase/db';
import { users } from '@formbase/db/schema';
import { env } from '@formbase/env';

import { lucia } from '../lucia';
import { signupSchema } from '../validators/auth';
import { generateEmailVerificationCode } from './utils';

export async function signup(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse<SignupInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = signupSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    columns: { email: true },
  });

  if (existingUser) {
    return {
      formError: 'Cannot create account with that email',
    };
  }

  const userId = generateId(21);
  const hashedPassword = await new Scrypt().hash(password);
  await db.insert(users).values({
    id: userId,
    email,
    hashedPassword,
  });

  const verificationCode = await generateEmailVerificationCode(userId, email);

  console.log('Signup Verification', verificationCode);

  void fetch(`${env.NEXT_PUBLIC_APP_URL}/api/mail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      code: verificationCode,
      type: 'verification',
    }),
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect('/verify-email');
}
