"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

type CopyButtonProps = {
  text: string;
};

export const CopyButton = ({ text }: CopyButtonProps) => {
  return (
    <Copy
      className="h-4 w-4 cursor-pointer text-muted-foreground transition-transform hover:scale-110 hover:transform"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        toast("Copied to clipboard", {
          icon: <Copy className="h-4 w-4" />,
        });
      }}
    />
  );
};
