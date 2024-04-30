"use client";

import { type manageSubscriptionSchema } from "@formbase/lib/validators/stripe";
import { api } from "@formbase/trpc/react";
import { Button } from "@formbase/ui/primitives/button";
import * as React from "react";
import { toast } from "sonner";
import { type z } from "zod";

type ManageSubscriptionFormProps = z.infer<typeof manageSubscriptionSchema>;

export function ManageSubscriptionForm({
  isPro,
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
}: ManageSubscriptionFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const managePlanMutation = api.stripe.managePlan.useMutation();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const session = await managePlanMutation.mutateAsync({
          isPro,
          stripeCustomerId,
          stripeSubscriptionId,
          stripePriceId,
        });

        if (session) {
          window.location.href = session.url ?? "/dashboard/billing";
        }
      } catch (err) {
        err instanceof Error
          ? toast.error(err.message)
          : toast.error("An error occurred. Please try again.");
      }
    });
  }

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <Button className="w-full" disabled={isPending}>
        {isPending ? "Loading..." : isPro ? "Manage plan" : "Subscribe now"}
      </Button>
    </form>
  );
}
