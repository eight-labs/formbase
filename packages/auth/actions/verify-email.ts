"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { User } from "@formbase/db/schema";

import { isWithinExpirationDate } from "oslo";

import { db, drizzlePrimitives } from "@formbase/db";
import { emailVerificationCodes, users } from "@formbase/db/schema";

import { auth } from "../auth";
import { lucia } from "../lucia";

export async function verifyEmail(
  _: unknown,
  formData: FormData,
): Promise<{ error: string }> {
  const code = formData.get("code");
  if (typeof code !== "string" || code.length !== 8) {
    return { error: "Invalid code" };
  }
  const { user } = (await auth()) as { user: User | null };
  if (!user) {
    return redirect("/login");
  }

  const dbCode = await db.transaction(async (tx) => {
    const item = await tx.query.emailVerificationCodes.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
    });
    if (item) {
      await tx
        .delete(emailVerificationCodes)
        .where(drizzlePrimitives.eq(emailVerificationCodes.id, item.id));
    }
    return item;
  });

  if (!dbCode || dbCode.code !== code)
    return { error: "Invalid verification code" };

  if (!isWithinExpirationDate(dbCode.expiresAt))
    return { error: "Verification code expired" };

  if (dbCode.email !== user.email) return { error: "Email does not match" };

  await lucia.invalidateUserSessions(user.id);
  await db
    .update(users)
    .set({ emailVerified: true })
    .where(drizzlePrimitives.eq(users.id, user.id));
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/dashboard");
}
