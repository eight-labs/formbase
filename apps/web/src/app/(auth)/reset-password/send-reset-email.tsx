'use client';

import { type FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { authClient } from '@formbase/auth/client';
import { Button } from '@formbase/ui/primitives/button';
import { Input } from '@formbase/ui/primitives/input';
import { Label } from '@formbase/ui/primitives/label';

import { LoadingButton } from '~/components/loading-button';

export function SendResetEmail() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      toast('A password reset link has been sent to your email.');
      router.push('/login');
    } catch {
      setFormError('Unable to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 -mt-4" onSubmit={handleResetRequest}>
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
        <Link href="/signup">
          <Button variant={'link'} size={'sm'} className="p-0">
            Not signed up? Sign up now
          </Button>
        </Link>
      </div>

      {formError ? (
        <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
          {formError}
        </p>
      ) : null}
      <LoadingButton className="w-full" loading={isSubmitting}>
        Reset Password
      </LoadingButton>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/">Cancel</Link>
      </Button>
    </form>
  );
}
