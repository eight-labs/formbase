'use client';

import { useState } from 'react';

import { CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { CreateFormDialog } from './create-form-dialog';

type CreateFormStepProps = {
  formId: string | null;
};

export const CreateFormStep = ({ formId }: CreateFormStepProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <p>Use the new endpoint to recieve submissions</p>

      {formId === null ? (
        <CreateFormDialog />
      ) : (
        <div>
          <pre className="rounded-lg border flex justify-between items-center text-white/90 dark:text-white bg-black p-4 w-[500px]">
            <>{`https://formbase.dev/s/${formId}`}</>
            {copied ? (
              <CheckCircle2 size={16} />
            ) : (
              <button
                onClick={async () => {
                  setCopied(true);
                  await navigator.clipboard.writeText(
                    `https://formbase.dev/s/${formId}`,
                  );

                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);

                  toast.success('Copied to clipboard');
                }}
              >
                <Copy size={16} />
              </button>
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
