import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@formbase/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@formbase/ui/primitives/dialog';
import { TrashIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { api } from '~/lib/trpc/react';

type DeleteFormDialogProps = {
  formId: string;
  onSuccessfulDelete?: () => void;
};

export function DeleteFormDialog({
  formId,
  onSuccessfulDelete,
}: DeleteFormDialogProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutateAsync: deleteForm, isPending: isFormDeleting } =
    api.form.delete.useMutation();

  const handleDelete = async () => {
    await deleteForm(
      {
        id: formId,
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success('Your form has been deleted', {
            icon: <TrashIcon className="h-4 w-4" />,
          });
          onSuccessfulDelete?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Form</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Form</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this form? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            loading={isFormDeleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
