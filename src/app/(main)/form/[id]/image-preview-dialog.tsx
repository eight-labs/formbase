import { TrashIcon } from "@radix-ui/react-icons";
import { DownloadIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

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
        <div
          className="relative h-8 w-8 overflow-hidden rounded-full border"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center backdrop-blur-sm hover:backdrop-blur-lg">
            <EyeIcon size={15} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <DialogTitle>{fileName}</DialogTitle>
              <a href={imageUrl} download={fileName} className="ml-2">
                <DownloadIcon size={20} />
              </a>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={imageUrl}
              alt={fileName}
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
