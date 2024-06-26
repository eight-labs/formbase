'use client';

import Link from 'next/link';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useFormState } from 'react-dom';

import { signup } from '@formbase/auth/actions';
import { Button } from '@formbase/ui/primitives/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@formbase/ui/primitives/card';
import { Input } from '@formbase/ui/primitives/input';
import { Label } from '@formbase/ui/primitives/label';

import { PasswordInput } from '~/components/password-input';
import { SubmitButton } from '~/components/submit-button';

export function Signup() {
  const [state, formAction] = useFormState(signup, null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Formbase Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login/github">
            <GitHubLogoIcon className="mr-2 h-5 w-5" />
            Sign up with GitHub
          </Link>
        </Button>
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t border-muted" />
          <div className="mx-2 text-muted-foreground">or</div>
          <div className="flex-grow border-t border-muted" />
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              required
              placeholder="email@example.com"
              autoComplete="email"
              name="email"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <PasswordInput
              name="password"
              required
              autoComplete="current-password"
              placeholder="********"
            />
          </div>

          {state?.fieldError ? (
            <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err) => (
                <li className="ml-4" key={err}>
                  {err}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state.formError}
            </p>
          ) : null}
          <div>
            <Link href={'/login'}>
              <Button variant={'link'} size={'sm'} className="p-0">
                Already signed up? Login instead.
              </Button>
            </Link>
          </div>

          <SubmitButton className="w-full"> Sign Up</SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
