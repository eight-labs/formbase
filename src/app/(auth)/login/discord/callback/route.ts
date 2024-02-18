import { cookies } from "next/headers";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { github, lucia } from "~/lib/auth";
import { db } from "~/server/db";
import { redirects } from "~/lib/constants";
import { users } from "~/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("GITHUB_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      headers: { Location: redirects.toLogin },
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserRes = await fetch("https://github.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser = (await githubUserRes.json()) as githubUser;

    if (!githubUser.email || !githubUser.verified) {
      return new Response(
        JSON.stringify({
          error: "Your github account must have a verified email address.",
        }),
        { status: 400, headers: { Location: redirects.toLogin } },
      );
    }
    const existingUser = await db.query.users.findFirst({
      where: (table, { eq, or }) =>
        or(
          eq(table.githubId, githubUser.id),
          eq(table.email, githubUser.email!),
        ),
    });

    const avatar = githubUser.avatar
      ? `https://cdn.githubapp.com/avatars/${githubUser.id}/${githubUser.avatar}.webp`
      : null;

    if (!existingUser) {
      const userId = generateId(21);
      await db.insert(users).values({
        id: userId,
        email: githubUser.email,
        emailVerified: true,
        githubId: githubUser.id,
        avatar,
      });
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: { Location: redirects.afterLogin },
      });
    }

    if (
      existingUser.githubId !== githubUser.id ||
      existingUser.avatar !== avatar
    ) {
      await db
        .update(users)
        .set({
          githubId: githubUser.id,
          emailVerified: true,
          avatar,
        })
        .where(eq(users.id, existingUser.id));
    }
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: { Location: redirects.afterLogin },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(JSON.stringify({ message: "Invalid code" }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ message: "internal server error" }), {
      status: 500,
    });
  }
}

interface githubUser {
  id: string;
  username: string;
  avatar: string | null;
  banner: string | null;
  global_name: string | null;
  banner_color: string | null;
  mfa_enabled: boolean;
  locale: string;
  email: string | null;
  verified: boolean;
}
