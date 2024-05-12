"use client";

import { resetPassword } from "@formbase/lib/auth/actions";
import { ExclamationTriangleIcon } from "@formbase/ui/components/icons";
import { PasswordInput } from "@formbase/ui/components/password-input";
import { SubmitButton } from "@formbase/ui/components/submit-button";
import { Label } from "@formbase/ui/primitives/label";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

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
