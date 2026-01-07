'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { FormEvent } from 'react';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { authClient } from '@formbase/auth/client';
import { Label } from '@formbase/ui/primitives/label';

import { LoadingButton } from '~/components/loading-button';
import { PasswordInput } from '~/components/password-input';

export function ResetPassword({ token }: { token: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get('password') ?? '');

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        setFormError(error.message);
        toast(error.message, {
          icon: (
            <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
          ),
        });
        return;
      }

      toast('Password reset successful.');
      router.push('/login');
    } catch {
      const errorMessage = 'Unable to reset password. Please try again.';
      setFormError(errorMessage);
      toast(errorMessage, {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="mt-8 space-y-4">
      <div>
        <Label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          New Password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="********"
          className="mt-2"
          required
        />
      </div>

      {formError ? (
        <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
          {formError}
        </p>
      ) : null}

      <LoadingButton
        className="mt-4 w-full py-2 font-medium"
        loading={isSubmitting}
      >
        Reset password
      </LoadingButton>
    </form>
  );
}
