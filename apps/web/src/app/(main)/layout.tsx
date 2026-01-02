import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getSession } from '@formbase/auth/server';

import { Header } from './_components/header';

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  const user = session?.user ?? null;

  if (!user) {
    redirect('/login');
  }

  if (!user.emailVerified) {
    redirect('/verify-email');
  }

  return (
    <>
      <Header user={user} />
      {children}
    </>
  );
};

export default MainLayout;
