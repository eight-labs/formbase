import { Lucia, TimeSpan } from "lucia";
import type { Adapter } from "lucia";
import { GitHub } from "arctic";
import { env } from "~/env.js";
import { sessions, users, type User as DbUser } from "@/server/db/schema";
import { db } from "@/server/db";
import { webcrypto } from "node:crypto";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

globalThis.crypto = webcrypto as unknown as Crypto;

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter as unknown as Adapter, {
  getSessionAttributes: (/* attributes */) => {
    return {};
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      emailVerified: attributes.emailVerified,
      avatar: attributes.avatar,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
    };
  },
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    name: "session",

    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
});

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  {
    redirectURI: env.NEXT_PUBLIC_APP_URL + "/login/github/callback",
  },
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> {}
