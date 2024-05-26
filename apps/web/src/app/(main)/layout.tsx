import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

import type { LuciaUser } from '@formbase/auth';

import { validateRequest } from '@formbase/auth';

import { Header } from './_components/header';

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const { user } = (await validateRequest()) as { user: LuciaUser | null };

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
