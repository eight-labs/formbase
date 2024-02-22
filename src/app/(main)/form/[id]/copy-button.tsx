"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "~/lib/hooks/use-copy-to-clipboard";

type CopyFormIdProps = {
  formId: string;
};

export default function CopyFormId({ formId }: CopyFormIdProps) {
  const [_, copy] = useCopyToClipboard();

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="inline-flex items-center rounded-lg bg-muted px-2 py-0.5 text-sm font-medium">
        {formId}
      </span>
      <Copy
        onClick={() =>
          copy(formId).then(() => {
            toast("Copied to Clipboard", {
              icon: <Copy className="h-4 w-4" />,
            });
          })
        }
        className="h-4 w-4 text-muted-foreground"
      />
    </div>
  );
}
