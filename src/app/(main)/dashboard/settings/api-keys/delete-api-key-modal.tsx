import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

type DeleteApiKeyDialogProps = {
  apiKeyId: string;
  onSuccessfulDelete?: () => void;
};

export function DeleteAPIKeyModal({
  apiKeyId,
  onSuccessfulDelete,
}: DeleteApiKeyDialogProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutateAsync: deleteApiKey, isLoading: isDeletingApiKey } =
    api.apiKeys.delete.useMutation();

  const handleDelete = async () => {
    await deleteApiKey(
      {
        id: apiKeyId,
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Your API Key has been deleted", {
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
        <TrashIcon className="h-5 w-5 text-red-500 hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Api Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this API Key? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full gap-4">
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
            loading={isDeletingApiKey}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
