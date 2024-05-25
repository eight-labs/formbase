import { redirect } from 'next/navigation';

import type { User } from '../../../../../../packages/db/schema';

import { validateRequest } from '@formbase/auth';
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
  description: 'Verify Email Page',
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
          <div className="mt-2">
            Verification code was sent to <strong>{user.email}</strong>. Check
            your spam folder if you can&apos;t find the email.
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCode />
      </CardContent>
    </Card>
  );
}
