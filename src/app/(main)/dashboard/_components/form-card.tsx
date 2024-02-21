import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type RouterOutputs } from "@/trpc/shared";

import { CopyButton } from "@/components/copy-button";
import { DeleteFormDialog } from "./delete-form-dialog";

type FormCardProp = {
  form: RouterOutputs["form"]["userForms"][number];
};

export function FormCard({ form }: FormCardProp) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{form.title}</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{form.id}</p>
              <CopyButton text={form.id} />
            </div>
          </div>
          <DeleteFormDialog formId={form.id} />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="mb-4 font-semibold text-muted-foreground">
          Submissions
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="text-muted-foreground">Monthly</span>
            </p>
            <p>343</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Last month</p>
            <p>24</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">All time</p>
            <p>531</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p className="text-sm text-muted-foreground">
            Last submission: 2/12/2021
          </p>
        </div>
        <Link
          href={`/form/${form.id}`}
          className="text-sm underline underline-offset-2"
        >
          View all
        </Link>
      </CardFooter>
    </Card>
  );
}
