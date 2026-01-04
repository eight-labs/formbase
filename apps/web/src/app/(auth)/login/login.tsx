'use client';

import { type FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { signIn } from '@formbase/auth/client';
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

export function Login() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSocialSignIn,
    loading: socialLoading,
    error: socialError,
  } = useSocialAuth();

  const displayError = formError ?? socialError;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const { error } = await signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      router.push('/dashboard');
    } catch {
      setFormError('Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Formbase Log In</CardTitle>
        <CardDescription>
          Log in to your account to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialLoginButtons
          onSocialSignIn={handleSocialSignIn}
          loading={socialLoading}
          variant="login"
        />
        <div className="my-2 flex items-center">
          <div className="grow border-t border-muted" />
          <div className="mx-2 text-muted-foreground">or</div>
          <div className="grow border-t border-muted" />
        </div>
        <form onSubmit={handleLogin} className="grid gap-4">
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

          <div className="flex flex-wrap justify-between">
            <Button variant={'link'} size={'sm'} className="p-0" asChild>
              <Link href={'/signup'}>Not signed up? Sign up now.</Link>
            </Button>
            <Button variant={'link'} size={'sm'} className="p-0" asChild>
              <Link href={'/reset-password'}>Forgot Password?</Link>
            </Button>
          </div>

          {displayError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {displayError}
            </p>
          ) : null}
          <LoadingButton type="submit" className="w-full" loading={isSubmitting}>
            Log In
          </LoadingButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
