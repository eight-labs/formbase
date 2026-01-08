import Link from 'next/link';

import { Logo } from '../../_components/logo';

import { ResetPassword } from './reset-password';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset Password Page',
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center space-x-1.5">
          <Logo className="h-7 w-7 text-foreground" aria-hidden={true} />
          <p className="font-medium text-lg text-foreground">Formbase</p>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground">
          Set new password
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your new password below.{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Back to sign in
          </Link>
        </p>
        <ResetPassword token={token} />
      </div>
    </div>
  );
}
