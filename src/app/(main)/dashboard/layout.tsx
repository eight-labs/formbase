import { redirect } from "next/navigation";
import * as React from "react";
import { validateRequest } from "~/lib/auth/validate-request";
import { redirects } from "~/lib/constants";

import { Poppins } from "next/font/google";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = await validateRequest();

  if (!user) redirect(redirects.toLogin);

  return (
    <div
      className={`container flex min-h-[calc(100vh-180px)] flex-col gap-6 px-2 pt-6 md:flex-row md:px-4 lg:gap-10 ${poppinsFont.className}`}
    >
      <main className="w-full">{children}</main>
    </div>
  );
}
