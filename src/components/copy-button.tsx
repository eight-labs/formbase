"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { useCopyToClipboard } from "~/lib/hooks/use-copy-to-clipboard";

type CopyButtonProps = {
  text: string;
  className?: string;
};

export const CopyButton = ({ text, className }: CopyButtonProps) => {
  const [_, copy] = useCopyToClipboard();

  return (
    <Copy
      className={`h-4 w-4 cursor-pointer text-muted-foreground transition-transform hover:scale-110 hover:transform ${className}`}
      onClick={async (e) => {
        e.preventDefault();
        copy(text).then(() => {
          toast("Copied to clipboard", {
            icon: <Copy className="h-4 w-4" />,
          });
        });
      }}
    />
  );
};
