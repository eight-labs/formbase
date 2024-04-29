// middleware.ts
import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@formbase/env";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    if (
      env.ALLOW_SIGNIN_SIGNUP === "false" &&
      request.nextUrl.pathname !== "/"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  const path = request.nextUrl.pathname;
  const url = request.nextUrl as unknown as URL;

  if (path.match("^/s/([a-zA-Z0-9_-]+)$")) {
    const subpath = path.split("/")[path.split("/").length - 1];

    return NextResponse.rewrite(new URL(`/api/s/${subpath}`, url));
  }

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
