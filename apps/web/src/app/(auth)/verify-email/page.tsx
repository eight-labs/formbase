import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { validateRequest } from "src/lib/auth/validate-request";
import { redirects } from "@formbase/lib/constants";
import type { User } from "@formbase/db/schema";

import { VerifyCode } from "./verify-code";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default async function ForgotPasswordPage() {
  const { user } = (await validateRequest()) as { user: User | null };

  if (!user) redirect(redirects.toLogin);
  if (user.emailVerified) redirect(redirects.afterVerify);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Verification code was sent to <strong>{user.email}</strong>. Check
          your spam folder if you can't find the email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCode />
      </CardContent>
    </Card>
  );
}
