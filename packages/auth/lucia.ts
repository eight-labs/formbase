import type { User } from '@formbase/db/schema';

import { db } from "@formbase/db";
import { sessions, users } from "@formbase/db/schema";
import { env } from "@formbase/env";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import type { User as LuciaUser } from 'lucia';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      email: attributes.email,
      id: attributes.id,
      emailVerified: attributes.emailVerified,
      avatar: attributes.avatar,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
    };
  },
});

type DatabaseUserAttributes = Omit<User, 'hashedPassword'>;

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}


// export lucia user type
export type UserInstance = LuciaUser;