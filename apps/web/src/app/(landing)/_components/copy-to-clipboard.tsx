"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";

export const CopyToClipboard = ({ text }: { text: string }) => {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      icon: <CopyIcon className="h-4 w-4" />,
    });
  };

  return (
    <div className="flex justify-center gap-3">
      <Input
        readOnly
        value={text}
        className="bg-secondary text-muted-foreground"
      />
      <Button size="icon" onClick={() => copyToClipboard()}>
        <CopyIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
