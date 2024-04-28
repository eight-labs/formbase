import { type ReactNode } from "react";

import { validateRequest } from "src/lib/auth/validate-request";

import { Header } from "./_components/header";
import { SiteFooter } from "./_components/site-footer";

async function LandingPageLayout({ children }: { children: ReactNode }) {
  const { user } = await validateRequest();

  return (
    <div className="bg-white dark:bg-black">
      <Header user={user} />
      {children}

      <SiteFooter />
    </div>
  );
}

export default LandingPageLayout;
