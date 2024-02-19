"use client";

import { type RouterOutputs } from "~/trpc/shared";
import * as React from "react";
import { CreateFormDialog } from "./new-form-dialog";
import Link from "next/link";

interface FormsProps {
  promises: Promise<
    [RouterOutputs["form"]["userForms"], RouterOutputs["stripe"]["getPlan"]]
  >;
}

export function Forms({ promises }: FormsProps) {
  /**
   * use is a React Hook that lets you read the value of a resource like a Promise or context.
   * @see https://react.dev/reference/react/use
   */
  const [forms, subscriptionPlan] = React.use(promises);

  /**
   * useOptimistic is a React Hook that lets you show a different state while an async action is underway.
   * It accepts some state as an argument and returns a copy of that state that can be different during the duration of an async action such as a network request.
   * @see https://react.dev/reference/react/useOptimistic
   */

  return (
    <div className="space-y-8">
      <CreateFormDialog />

      <div className="flex flex-col space-y-2">
        {forms.map((form) => (
          <Link href={`/form/${form.id}`} key={form.id}>
            {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
            Name: {form.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
