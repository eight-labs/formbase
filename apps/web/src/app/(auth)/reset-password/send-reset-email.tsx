"use client";

import { sendPasswordResetLink } from "@formbase/lib/auth/actions";
import { redirects } from "@formbase/lib/constants";
import { ExclamationTriangleIcon } from "@formbase/ui/components/icons";
import { SubmitButton } from "@formbase/ui/components/submit-button";
import { Button } from "@formbase/ui/primitives/button";
import { Input } from "@formbase/ui/primitives/input";
import { Label } from "@formbase/ui/primitives/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function SendResetEmail() {
  const [state, formAction] = useFormState(sendPasswordResetLink, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast("A password reset link has been sent to your email.");
      router.push(redirects.toLogin);
    }
    if (state?.error) {
      toast(state.error, {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    }
  }, [state?.error, state?.success]);

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label>Your Email</Label>
        <Input
          required
          placeholder="email@example.com"
          autoComplete="email"
          name="email"
          type="email"
        />
      </div>

      <div className="flex flex-wrap justify-between">
        <Link href={redirects.toSignup}>
          <Button variant={"link"} size={"sm"} className="p-0">
            Not signed up? Sign up now
          </Button>
        </Link>
      </div>

      <SubmitButton className="w-full">Reset Password</SubmitButton>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/">Cancel</Link>
      </Button>
    </form>
  );
}
