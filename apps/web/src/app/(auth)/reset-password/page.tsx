import { redirect } from 'next/navigation';

import { getSession } from '@formbase/auth/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@formbase/ui/primitives/card';

import { SendResetEmail } from './send-reset-email';

export const metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password Page',
};

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>
          Password reset link will be sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SendResetEmail />
      </CardContent>
    </Card>
  );
}
