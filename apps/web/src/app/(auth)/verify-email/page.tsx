import { redirect } from 'next/navigation';

import { validateRequest } from '@formbase/auth';
import { type User } from '@formbase/db/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@formbase/ui/primitives/card';

import { VerifyCode } from './verify-code';

export const metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to continue.',
};

export default async function ForgotPasswordPage() {
  const { user } = (await validateRequest()) as { user: User | null };

  if (!user) {
    redirect('/login');
  }

  if (user.emailVerified) {
    redirect('/dashboard');
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Verification code was sent to <strong>{user.email}</strong>. Check
          your spam folder if you can&apos;t find the email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCode />
      </CardContent>
    </Card>
  );
}
