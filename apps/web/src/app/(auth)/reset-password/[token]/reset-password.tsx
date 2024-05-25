'use client';

import { useEffect } from 'react';

import { resetPassword } from '@formbase/auth/actions';
import { Label } from '@formbase/ui/primitives/label';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { PasswordInput } from '~/components/password-input';
import { SubmitButton } from '~/components/submit-button';

export function ResetPassword({ token }: { token: string }) {
  const [state, formAction] = useFormState(resetPassword, null);

  useEffect(() => {
    if (state?.error) {
      toast(state.error, {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    }
  }, [state?.error]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label>New Password</Label>
        <PasswordInput
          name="password"
          required
          autoComplete="new-password"
          placeholder="********"
        />
      </div>
      <SubmitButton className="w-full">Reset Password</SubmitButton>
    </form>
  );
}
