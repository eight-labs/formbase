import { redirect } from 'next/navigation';

import type { LuciaUser } from '@formbase/auth';

import { validateRequest } from '@formbase/auth';
import { logout } from '@formbase/auth/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@formbase/ui/primitives/card';

import { SubmitButton } from '~/components/submit-button';

export default async function AccountPage() {
  const { user } = (await validateRequest()) as { user: LuciaUser | null };
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="container mx-auto min-h-screen p-4">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle> {user.email}!</CardTitle>
          <CardDescription>You&apos;ve successfully logged in!</CardDescription>
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
