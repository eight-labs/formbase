// import { cookies } from 'next/headers';

// import { generateState } from 'arctic';

// import { env } from '@formbase/env';
// import { github } from '@formbase/lib/auth';

// export async function GET(): Promise<Response> {
//   const state = generateState();
//   const url = await github.createAuthorizationURL(state, {
//     scopes: ['read:user', 'user:email'],
//   });

//   cookies().set('github_oauth_state', state, {
//     path: '/',
//     secure: env.NODE_ENV === 'production',
//     httpOnly: true,
//     maxAge: 60 * 10,
//     sameSite: 'lax',
//   });

//   return Response.redirect(url);
// }

import { createGithubAuthorizationURL } from '@formbase/auth/providers/github';

export { createGithubAuthorizationURL as GET };
