import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { Header } from "./_components/header";
import { validateRequest } from "~/lib/auth/validate-request";
import { redirects } from "~/lib/constants";
import type { User } from "~/server/db/schema";

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
