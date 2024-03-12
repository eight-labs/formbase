import { TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
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

type ImagePreviewDialogProps = {
  fileName: string;
  imageUrl: string;
};

export function ImagePreviewDialog({
  fileName,
  imageUrl,
}: ImagePreviewDialogProps) {
  const [open, setOpen] = useState(false);

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
        <div className="flex items-center justify-center">
          <Image src={imageUrl} alt={fileName} fill />
        </div>
      </DialogContent>
    </Dialog>
  );
}
