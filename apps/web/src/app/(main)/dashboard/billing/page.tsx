import type { Metadata } from "next";
import { redirect } from "next/navigation";
import * as React from "react";

import { ExclamationTriangleIcon } from "src/components/icons";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { env } from "@formbase/env";
import { validateRequest } from "@formbase/lib/auth/validate-request";
import { APP_TITLE } from "@formbase/lib/constants";
import { api } from "src/trpc/server";

import { Billing } from "./_components/billing";
import { BillingSkeleton } from "./_components/billing-skeleton";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Billing",
  description: "Manage your billing and subscription",
};

export default async function BillingPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/signin");
  }

  const stripePromises = Promise.all([
    api.stripe.getPlans.query(),
    api.stripe.getPlan.query(),
  ]);

  return (
    <div className="grid gap-8 py-10 md:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-medium">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your billing and subscription
        </p>
      </div>
      <section>
        <Alert className="p-6 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-10">
          <ExclamationTriangleIcon className="h-6 w-6" />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription>
            {APP_TITLE} app is a demo app using a Stripe test environment. You
            can find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
      </section>
      <React.Suspense fallback={<BillingSkeleton />}>
        <Billing stripePromises={stripePromises} />
      </React.Suspense>
    </div>
  );
}
