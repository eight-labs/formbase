'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { authClient, signOut } from '@formbase/auth/client';
import { Button } from '@formbase/ui/primitives/button';

import { LoadingButton } from '~/components/loading-button';

export const VerifyEmail = ({ email }: { email?: string | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [attemptedToken, setAttemptedToken] = useState<string | null>(null);

  useEffect(() => {
    if (!token || token === attemptedToken) return;

    setAttemptedToken(token);
    setIsVerifying(true);
    authClient
      .verifyEmail({ query: { token } })
      .then(({ error }) => {
        if (error) {
          toast(error.message, {
            icon: (
              <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
            ),
          });
          return;
        }

        toast('Email verified');
        router.push('/onboarding');
      })
      .catch(() => {
        toast('Unable to verify email. Please try again.', {
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
        });
      })
      .finally(() => setIsVerifying(false));
  }, [token, attemptedToken, router]);

  const handleResend = async () => {
    if (!email) {
      toast('Sign in to resend the verification email.');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/onboarding',
      });

      if (error) {
        toast(error.message, {
          icon: (
            <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
          ),
        });
        return;
      }

      toast('Verification email sent.');
    } catch {
      toast('Unable to resend verification email.', {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast(error.message, {
          icon: (
            <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
          ),
        });
        return;
      }

      window.location.href = '/';
    } catch {
      toast('Unable to sign out. Please try again.', {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        {token
          ? 'Verifying your email...'
          : 'Check your email for a verification link.'}
      </p>
      <LoadingButton
        className="w-full"
        variant="secondary"
        loading={isResending}
        disabled={!email}
        onClick={() => {
          void handleResend();
        }}
      >
        Resend Email
      </LoadingButton>
      <Button
        variant="link"
        className="p-0 mt-2 font-normal"
        disabled={isSigningOut}
        onClick={() => {
          void handleSignOut();
        }}
      >
        Want to use another email? Log out now.
      </Button>
    </div>
  );
};
