import { CopyIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type RouterOutputs } from "@/trpc/shared";

import { DeleteFormDialog } from "./delete-form-dialog";

type FormCardProp = {
  form: RouterOutputs["form"]["userForms"][number];
};

export function FormCard({ form }: FormCardProp) {
  const handleCopyAction = async () => {
    await navigator.clipboard.writeText(form.id);
    toast("Copied to clipboard", {
      icon: <CopyIcon className="h-4 w-4" />,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{form.title}</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{form.id}</p>
              <CopyIcon
                className="h-4 w-4 cursor-pointer text-muted-foreground transition-transform hover:scale-110 hover:transform"
                onClick={handleCopyAction}
              />
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
