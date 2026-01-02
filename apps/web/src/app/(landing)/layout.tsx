import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getSession } from '@formbase/auth/server';

import { Header } from './_components/header';
import { SiteFooter } from './_components/site-footer';

async function LandingPageLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const user = session?.user ?? null;

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-white dark:bg-black">
      <Header user={user} />
      {children}

      <SiteFooter />
    </div>
  );
}

export default LandingPageLayout;
