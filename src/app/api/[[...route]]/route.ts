import { Hono } from "hono";
import { handle } from "hono/vercel";

import { publicFormRouter } from "./routes/forms";
import { verifyApiKey } from "./routes/util";

export type Variables = {
  userId: string;
  apiKeyID: string;
};

export const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.use("/forms/*", async (c, next) => {
  const authorizationKey = c.req.raw.headers.get("x-formbase-key");
  if (!authorizationKey) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { error, result } = await verifyApiKey(authorizationKey);

  if (error) {
    return c.json({ error: error.message }, 401);
  }

  c.set("userId", result.ownerId);
  c.set("apiKeyID", result.apiKeyID);

  await next();
});

app.route("/forms", publicFormRouter);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
