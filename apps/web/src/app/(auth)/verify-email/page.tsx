import { redirect } from 'next/navigation';

import { getSession } from '@formbase/auth/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@formbase/ui/primitives/card';

import { VerifyEmail } from './verify-code';

export const metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to continue.',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  const session = await getSession();
  const token = searchParams?.token;

  if (!session && !token) {
    redirect('/login');
  }

  if (session?.user.emailVerified) {
    redirect('/dashboard');
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          {session?.user.email ? (
            <>
              Verification email was sent to{' '}
              <strong>{session.user.email}</strong>. Check your spam folder if
              you can&apos;t find the email.
            </>
          ) : (
            <>Use the verification link from your email to continue.</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyEmail email={session?.user.email} />
      </CardContent>
    </Card>
  );
}
