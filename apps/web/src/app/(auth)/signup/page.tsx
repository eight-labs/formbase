import { redirect } from 'next/navigation';

import { getSession } from '@formbase/auth/server';

import { Signup } from './signup';

export const metadata = {
  title: 'Sign Up',
  description: 'Signup Page',
};

export default async function SignupPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return <Signup />;
}
