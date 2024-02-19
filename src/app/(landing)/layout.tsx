import { APP_TITLE } from "~/lib/constants";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";

export const metadata: Metadata = {
  title: APP_TITLE,
  description: "Manage forms with ease",
};

function LandingPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default LandingPageLayout;
