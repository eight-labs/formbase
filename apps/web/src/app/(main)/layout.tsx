import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { validateRequest } from "@formbase/lib/auth/validate-request";
import { redirects } from "@formbase/lib/constants";
import type { User } from "@formbase/db/schema";

import { Header } from "./_components/header";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const { user } = (await validateRequest()) as { user: User | null };

  if (!user) redirect(redirects.toLogin);
  if (user.emailVerified === false) redirect(redirects.toVerify);

  return (
    <>
      <Header user={user} />
      {children}
    </>
  );
};

export default MainLayout;
