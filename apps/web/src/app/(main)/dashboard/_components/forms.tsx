"use client";

import { use } from "react";

import { type RouterOutputs } from "@formbase/api";

import { EmptyFormState } from "./empty-state";
import { FormCard } from "./form-card";

interface FormsProps {
  promises: Promise<
    // [RouterOutputs['form']['userForms'], RouterOutputs['stripe']['getPlan']]
    [RouterOutputs["form"]["userForms"]]
  >;
}

export function Forms({ promises }: FormsProps) {
  const [forms] = use(promises);

  return (
    <div className="space-y-8">
      {forms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {forms.map((form) => (
            <FormCard
              form={form}
              key={form.id}
              submissionsCount={form.formData.length}
              updatedAt={form.updatedAt}
              createdAt={form.createdAt}
            />
          ))}
        </div>
      ) : (
        <EmptyFormState status="form" />
      )}
    </div>
  );
}
