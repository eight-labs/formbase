import * as React from 'react';
import { redirect } from 'next/navigation';

import { validateRequest } from '@formbase/auth';

interface Props {
  children: React.ReactNode;
}

export default async function FormLayout({ children }: Props) {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container flex min-h-[calc(100vh-180px)] flex-col gap-6 px-2 pt-6 md:flex-row md:px-4 lg:gap-10">
      <main className="w-full">{children}</main>
    </div>
  );
}
