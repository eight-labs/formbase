import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

type DeleteFormDialogProps = {
  formId: string;
};

export function DeleteFormDialog({ formId }: DeleteFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const { mutateAsync: deleteForm } = api.form.delete.useMutation();

  const handleDelete = async () => {
    await deleteForm(
      {
        id: formId,
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Your form has been deleted", {
            icon: <TrashIcon className="h-4 w-4" />,
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group flex w-full items-center gap-2 rounded-md hover:cursor-pointer dark:bg-none">
          <TrashIcon className="h-4 w-4 duration-300 group-hover:text-red-500 dark:text-white" />
          <span className="hover:text-red-500">Delete</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this form?</DialogTitle>
          <DialogDescription>
            This will delete all associated submissions and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 flex w-full gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
