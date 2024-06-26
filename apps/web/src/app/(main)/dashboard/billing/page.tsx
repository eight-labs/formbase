import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { validateRequest } from '@formbase/auth';
import { env } from '@formbase/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Billing',
  description: 'Manage your billing and subscription',
};

export default async function BillingPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/signin');
  }

  redirect('/dashboard');

  //   const stripePromises = Promise.all([
  //     api.stripe.getPlans(),
  //     api.stripe.getPlan(),
  //   ]);

  //   return (
  //     <div className="grid gap-8 py-10 md:py-8">
  //       <div className="mb-6">
  //         <h1 className="text-3xl font-medium">Billing</h1>
  //         <p className="text-sm text-muted-foreground">
  //           Manage your billing and subscription
  //         </p>
  //       </div>
  //       <section>
  //         <Alert className="p-6 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-10">
  //           <ExclamationTriangleIcon className="h-6 w-6" />
  //           <AlertDescription>
  //             Formbase app is a demo app using a Stripe test environment. You can
  //             find a list of test card numbers on the{' '}
  //             <a
  //               href="https://stripe.com/docs/testing#cards"
  //               target="_blank"
  //               rel="noreferrer"
  //               className="font-medium underline underline-offset-4"
  //             >
  //               Stripe docs
  //             </a>
  //             .
  //           </AlertDescription>
  //         </Alert>
  //       </section>
  //       <React.Suspense fallback={<BillingSkeleton />}>
  //         <Billing stripePromises={stripePromises} />
  //       </React.Suspense>
  //     </div>
  //   );
}
