import * as React from 'react';
import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';

import { validateRequest } from '@formbase/auth';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = await validateRequest();

  if (!user) redirect('/login');

  return (
    <div
      className={`container flex min-h-[calc(100vh-180px)] flex-col gap-6 px-2 pt-6 md:flex-row md:px-4 lg:gap-10 ${inter.className}`}
    >
      <main className="w-full">{children}</main>
    </div>
  );
}
