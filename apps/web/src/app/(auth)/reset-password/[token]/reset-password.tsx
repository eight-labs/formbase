'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { authClient } from '@formbase/auth/client';
import { Label } from '@formbase/ui/primitives/label';

import { LoadingButton } from '~/components/loading-button';
import { PasswordInput } from '~/components/password-input';

export function ResetPassword({ token }: { token: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get('password') ?? '');

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        toast(error.message, {
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
        });
        return;
      }

      toast('Password reset successful.');
      router.push('/login');
    } catch {
      toast('Unable to reset password. Please try again.', {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <div className="space-y-2">
        <Label>New Password</Label>
        <PasswordInput
          name="password"
          required
          autoComplete="new-password"
          placeholder="********"
        />
      </div>
      <LoadingButton type="submit" className="w-full" loading={isSubmitting}>
        Reset Password
      </LoadingButton>
    </form>
  );
}
