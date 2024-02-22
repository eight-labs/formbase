"use client";

import { use } from "react";

import { type RouterOutputs } from "~/trpc/shared";

import { FormCard } from "./form-card";

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
  const [forms, subscriptionPlan] = use(promises);

  /**
   * useOptimistic is a React Hook that lets you show a different state while an async action is underway.
   * It accepts some state as an argument and returns a copy of that state that can be different during the duration of an async action such as a network request.
   * @see https://react.dev/reference/react/useOptimistic
   */

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {forms.map((form) => (
          <FormCard form={form} key={form.id} />
        ))}
      </div>
    </div>
  );
}
