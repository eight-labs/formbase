import crypto from "crypto";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { apiKeys } from "~/server/db/schema";

type VerifyApiKeyReturnType =
  | {
      result: {
        ownerId: string;
        apiKeyID: string;
      };
      error?: undefined;
    }
  | {
      error: Error;
      result?: undefined;
    };

export const verifyApiKey = async (
  key: string,
): Promise<VerifyApiKeyReturnType> => {
  const hash = crypto.createHash("sha256").update(key).digest("hex");

  const hashedKey = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.key, hash),
  });

  if (!hashedKey) {
    return { error: new Error("Invalid API Key") };
  }

  return { result: { ownerId: hashedKey.userId, apiKeyID: hashedKey.id } };
};
