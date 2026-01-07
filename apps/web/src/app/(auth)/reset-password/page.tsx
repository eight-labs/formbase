import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getSession } from '@formbase/auth/server';

import { Logo } from '../_components/logo';

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
    <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center space-x-1.5">
          <Logo className="h-7 w-7 text-foreground" aria-hidden={true} />
          <p className="font-medium text-lg text-foreground">Formbase</p>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground">
          Reset your password
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link. Remember your
          password?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
        <SendResetEmail />
      </div>
    </div>
  );
}
