import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RouterOutputs } from "@/trpc/shared";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteFormDialog } from "./delete-form-dialog";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

type FormCardProp = {
  form: RouterOutputs["form"]["userForms"][number];
};

export async function FormCard({ form }: FormCardProp) {
  const { data, isLoading: isLoadingFormSubmissionsCount } =
    api.form.formSubmissions.useQuery({
      formId: form.id,
    });

  return (
    <Link href={`/form/${form.id}`} className="text-sm underline-offset-2">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{form.title}</CardTitle>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {form.id}
                </span>
                <CopyButton text={form.id} />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Form menu</span>
                  <DotsVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                  <DeleteFormDialog formId={form.id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          {isLoadingFormSubmissionsCount ? (
            <Skeleton className="h-3 w-[100px]" />
          ) : (
            <p className="mb-1 text-sm text-muted-foreground">
              {(data && data[0]?.count) ?? 0} submissions
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Last submission:{" "}
            {formatDistanceToNow(
              new Date(form.updatedAt ? form.updatedAt : form.createdAt),
              {
                addSuffix: true,
              },
            )}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
