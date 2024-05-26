import { redirect } from 'next/navigation';

import { validateRequest } from '@formbase/auth';

import { Signup } from './signup';

export const metadata = {
  title: 'Sign Up',
  description: 'Signup Page',
};

export default async function SignupPage() {
  const { user } = await validateRequest();

  if (user) {
    redirect('/dashboard');
  }

  return <Signup />;
}
