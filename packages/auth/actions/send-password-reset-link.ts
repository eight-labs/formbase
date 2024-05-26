"use server";

import { z } from "zod";

import { db } from "@formbase/db";
import { env } from "@formbase/env";

import { generatePasswordResetToken } from "./utils";

export async function sendPasswordResetLink(
  _: unknown,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email");
  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) {
    return { error: "Provided email is invalid." };
  }

  try {
    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, parsed.data),
    });

    if (!user?.emailVerified) {
      return { success: true };
    }

    const verificationToken = await generatePasswordResetToken(user.id);
    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/reset-password/${verificationToken}`;

    void fetch(`${env.NEXT_PUBLIC_APP_URL}/api/mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        link: verificationLink,
        type: "reset",
      }),
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send verification email." };
  }
}
