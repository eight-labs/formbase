'use client';

import { type FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { signUp } from '@formbase/auth/client';
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

import { LoadingButton } from '~/components/loading-button';
import { PasswordInput } from '~/components/password-input';
import { SocialLoginButtons } from '~/components/social-login-buttons';
import { useSocialAuth } from '~/lib/hooks/use-social-auth';

export function Signup() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSocialSignIn,
    loading: socialLoading,
    error: socialError,
  } = useSocialAuth();

  const displayError = formError ?? socialError;

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
        callbackURL: '/onboarding',
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      router.push('/verify-email');
    } catch {
      setFormError('Unable to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Formbase Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <SocialLoginButtons
          onSocialSignIn={handleSocialSignIn}
          loading={socialLoading}
          variant="signup"
        />
        <div className="my-2 flex items-center">
          <div className="grow border-t border-muted" />
          <div className="mx-2 text-muted-foreground">or</div>
          <div className="grow border-t border-muted" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              required
              placeholder="Jane Doe"
              autoComplete="name"
              name="name"
              type="text"
            />
          </div>
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

          {displayError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {displayError}
            </p>
          ) : null}
          <div>
            <Link href={'/login'}>
              <Button variant={'link'} size={'sm'} className="p-0">
                Already signed up? Login instead.
              </Button>
            </Link>
          </div>

          <LoadingButton type="submit" className="w-full" loading={isSubmitting}>
            Sign Up
          </LoadingButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
