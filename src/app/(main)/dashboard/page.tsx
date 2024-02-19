import { env } from "~/env";
import { api } from "~/trpc/server";
import { type Metadata } from "next";
import * as React from "react";
import { Forms } from "./_components/forms";
import { PostsSkeleton } from "./_components/posts-skeleton";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Forms",
  description: "Manage your forms here",
};

export default async function DashboardPage() {
  /**
   * Passing multiple promises to `Promise.all` to fetch data in parallel to prevent waterfall requests.
   * Passing promises to the `Posts` component to make them hot promises (they can run without being awaited) to prevent waterfall requests.
   * @see https://www.youtube.com/shorts/A7GGjutZxrs
   * @see https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
   */
  const promises = Promise.all([
    api.form.userForms.query({}),
    api.stripe.getPlan.query(),
  ]);

  return (
    <div className="py-10 md:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Forms</h1>
        <p className="text-sm text-muted-foreground">Manage your forms here</p>
      </div>
      <React.Suspense fallback={<PostsSkeleton />}>
        <Forms promises={promises} />
      </React.Suspense>
    </div>
  );
}
