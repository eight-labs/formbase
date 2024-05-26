"use server";

import { redirect } from "next/navigation";

import type { User } from "@formbase/db/schema";

import { isWithinExpirationDate } from "oslo";

import { db } from "@formbase/db";
import { env } from "@formbase/env";

import { auth } from "../auth";
import { generateEmailVerificationCode } from "./utils";

const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};

export async function resendVerificationEmail(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const { user } = (await auth()) as { user: User | null };
  if (!user) {
    return redirect("/login");
  }
  const lastSent = await db.query.emailVerificationCodes.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
    columns: { expiresAt: true },
  });

  if (lastSent && isWithinExpirationDate(lastSent.expiresAt)) {
    const timeString = timeFromNow(lastSent.expiresAt);

    return {
      error: `Please wait ${timeString} before resending`,
    };
  }
  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email,
  );

  void fetch(`${env.NEXT_PUBLIC_APP_URL}/api/mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      code: verificationCode,
      type: "verification",
    }),
  });

  return { success: true };
}
