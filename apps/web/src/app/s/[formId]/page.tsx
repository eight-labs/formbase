import Link from 'next/link';

import { Button } from '@formbase/ui/primitives/button';

import { api } from '~/lib/trpc/server';

export default async function FormCompletedPage({
  params,
}: {
  params: { formId: string };
}) {
  const form = await api.form.hasReturiningUrl({ formId: params.formId });

  if (!form) {
    return (
      <div className="container flex h-screen flex-col items-center justify-center gap-3">
        <h2 className="text-xl font-medium">Form not found</h2>
        <Link href="/">
          <Button>Return</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-3">
      <h2 className="text-xl font-medium">Done Submitting using Formbase</h2>

      {form.returnUrl && (
        <a href={form.returnUrl}>
          <Button>Return</Button>
        </a>
      )}
    </div>
  );
}
