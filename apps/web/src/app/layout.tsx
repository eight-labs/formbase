import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { ThemeProvider } from "src/components/theme-provider";
import { Toaster } from "src/components/ui/sonner";
import { env } from "@formbase/env";
import { APP_TITLE } from "@formbase/lib/constants";
import { fontSans } from "src/lib/fonts";
import { cn } from "src/lib/utils";
import { TRPCReactProvider } from "src/trpc/react";

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_TITLE}`,
  },
  description: "Manage forms with ease",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
        {env.UMAMI_TRACKING_ID && (
          <Script
            async
            src="https://analytics.duncan.land/script.js"
            data-website-id={env.UMAMI_TRACKING_ID}
          />
        )}
      </body>
    </html>
  );
}
