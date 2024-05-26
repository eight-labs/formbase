"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Scrypt } from "lucia";
import { isWithinExpirationDate } from "oslo";

import { db, drizzlePrimitives } from "@formbase/db";
import { passwordResetTokens, users } from "@formbase/db/schema";

import { lucia } from "../lucia";
import { resetPasswordSchema } from "../validators/auth";

export async function resetPassword(
  _: unknown,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = resetPasswordSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      error:
        err.fieldErrors.password?.[0] ??
        err.fieldErrors.token?.[0] ??
        "Unknown error occurred",
    };
  }
  const { token, password } = parsed.data;

  const dbToken = await db.transaction(async (tx) => {
    const item = await tx.query.passwordResetTokens.findFirst({
      where: (table, { eq }) => eq(table.id, token),
    });
    if (item) {
      await tx
        .delete(passwordResetTokens)
        .where(drizzlePrimitives.eq(passwordResetTokens.id, item.id));
    }
    return item;
  });

  if (!dbToken) return { error: "Invalid password reset link" };

  if (!isWithinExpirationDate(dbToken.expiresAt))
    return { error: "Password reset link expired." };

  await lucia.invalidateUserSessions(dbToken.userId);
  const hashedPassword = await new Scrypt().hash(password);
  await db
    .update(users)
    .set({ hashedPassword })
    .where(drizzlePrimitives.eq(users.id, dbToken.userId));
  const session = await lucia.createSession(dbToken.userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/dashboard");
}
