'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { authClient, signOut } from '@formbase/auth/client';

import { LoadingButton } from '~/components/loading-button';

export const VerifyEmail = ({ email }: { email?: string | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isResending, setIsResending] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!token) return;

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
      });
  }, [token, router]);

  const handleResend = async () => {
    if (!email) return;
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
    <div className="mt-8 flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {token ? 'Verifying your email...' : null}
      </p>
      <LoadingButton
        className="w-full py-2 font-medium"
        variant="outline"
        loading={isResending}
        disabled={!email}
        onClick={() => {
          void handleResend();
        }}
      >
        Resend verification email
      </LoadingButton>
      <p className="text-sm text-muted-foreground">
        Want to use a different email?{' '}
        <button
          type="button"
          className="font-medium text-primary hover:text-primary/90"
          disabled={isSigningOut}
          onClick={() => {
            void handleSignOut();
          }}
        >
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </button>
      </p>
    </div>
  );
};
