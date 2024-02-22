import { type Metadata } from "next";
import { type ReactNode } from "react";

import { validateRequest } from "~/lib/auth/validate-request";
import { APP_TITLE } from "~/lib/constants";

import { Header } from "./_components/header";

export const metadata: Metadata = {
  title: APP_TITLE,
  description: "Manage forms with ease",
};

async function LandingPageLayout({ children }: { children: ReactNode }) {
  const { user } = await validateRequest();

  return (
    <>
      <Header user={user} />
      {children}
    </>
  );
}

export default LandingPageLayout;
