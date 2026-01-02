import { redirect } from 'next/navigation';

import { getSession } from '@formbase/auth/server';

import { Login } from './login';

export const metadata = {
  title: 'Login',
  description: 'Login Page',
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return <Login />;
}
