import Stripe from "stripe";
import * as z from "zod";

import { env } from "@formbase/env";
import { absoluteUrl, formatPrice } from "@formbase/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export interface SubscriptionPlan {
  name: string;
  description: string;
  features: string[];
  stripePriceId: string;
}

export const manageSubscriptionSchema = z.object({
  stripePriceId: z.string(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  isPro: z.boolean(),
});

const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "The free plan is limited to 3 posts.",
  features: ["Up to 3 posts", "Limited support"],
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "The Pro plan has unlimited posts.",
  features: ["Unlimited posts", "Priority support"],
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID,
};

export const subscriptionPlans = [freePlan, proPlan];

export const stripeRouter = createTRPCRouter({
  getPlans: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, ctx.user.id),
        columns: {
          id: true,
        },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      const proPrice = await stripe.prices.retrieve(proPlan.stripePriceId);

      return subscriptionPlans.map((plan) => {
        return {
          ...plan,
          price:
            plan.stripePriceId === proPlan.stripePriceId
              ? formatPrice((proPrice.unit_amount ?? 0) / 100, {
                  currency: proPrice.currency,
                })
              : formatPrice(0, { currency: proPrice.currency }),
        };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }),
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, ctx.user.id),
        columns: {
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          stripeSubscriptionId: true,
          stripeCustomerId: true,
        },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // Check if user is on a pro plan
      const isPro =
        !!user.stripePriceId &&
        (user.stripeCurrentPeriodEnd?.getTime() ?? 0) + 86_400_000 > Date.now();

      const plan = isPro ? proPlan : freePlan;

      // Check if user has canceled subscription
      let isCanceled = false;
      if (isPro && !!user.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
          user.stripeSubscriptionId,
        );
        isCanceled = stripePlan.cancel_at_period_end;
      }

      return {
        ...plan,
        stripeSubscriptionId: user.stripeSubscriptionId,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
        stripeCustomerId: user.stripeCustomerId,
        isPro,
        isCanceled,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }),
  managePlan: protectedProcedure
    .input(manageSubscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      const billingUrl = absoluteUrl("/dashboard/billing");

      const user = await ctx.db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, ctx.user.id),
        columns: {
          id: true,
          email: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
        },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // If the user is already subscribed to a plan, we redirect them to the Stripe billing portal
      if (input.isPro && input.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: input.stripeCustomerId,
          return_url: billingUrl,
        });

        return {
          url: stripeSession.url,
        };
      }

      // If the user is not subscribed to a plan, we create a Stripe Checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.email,
        line_items: [
          {
            price: input.stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
        },
      });

      return {
        url: stripeSession.url,
      };
    }),
});
