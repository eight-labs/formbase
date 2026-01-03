import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@formbase/ui/primitives/card';

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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter a new password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPassword token={token} />
      </CardContent>
    </Card>
  );
}
