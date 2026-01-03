'use client';

import { useState } from 'react';

import { signIn } from '@formbase/auth/client';

type SocialProvider = 'github' | 'google';

interface UseSocialAuthOptions {
  callbackURL?: string;
  newUserCallbackURL?: string;
}

export function useSocialAuth(options: UseSocialAuthOptions = {}) {
  const {
    callbackURL = '/dashboard',
    newUserCallbackURL = '/onboarding',
  } = options;

  const [loading, setLoading] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setError(null);
    setLoading(provider);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL,
        newUserCallbackURL,
      });

      if (error) {
        setError(error.message);
        setLoading(null);
      }
    } catch {
      setError('Unable to sign in. Please try again.');
      setLoading(null);
    }
  };

  return {
    handleSocialSignIn,
    loading,
    error,
  };
}
