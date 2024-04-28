import { redirect } from "next/navigation";

import { SubmitButton } from "src/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { logout } from "src/lib/auth/actions";
import { validateRequest } from "src/lib/auth/validate-request";
import { redirects } from "src/lib/constants";
import type { User } from "src/server/db/schema";

export default async function AccountPage() {
  const { user } = (await validateRequest()) as { user: User | null };
  if (!user) redirect(redirects.toLogin);

  return (
    <main className="container mx-auto min-h-screen p-4">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle> {user.email}!</CardTitle>
          <CardDescription>You've successfully logged in!</CardDescription>
        </CardHeader>
        <CardContent>This is a private page.</CardContent>
        <CardFooter>
          <form action={logout}>
            <SubmitButton variant="outline">Logout</SubmitButton>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
