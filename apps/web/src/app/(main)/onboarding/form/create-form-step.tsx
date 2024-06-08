import { CopyButton } from '~/components/copy-button';

import { CreateFormDialog } from './create-form-dialog';

type CreateFormStepProps = {
  formId: string | null;
};

export const CreateFormStep = ({ formId }: CreateFormStepProps) => {
  return (
    <div className="-mt-0.5">
      <h2 className="text-xl font-semibold">Add a new form endpoint</h2>
      <div className="text-gray-600 dark:text-muted-foreground mt-2"></div>
      <div className="space-y-4">
        <p>Use the new endpoint to recieve submissions</p>

        {formId === null ? (
          <CreateFormDialog />
        ) : (
          <div>
            <pre className="rounded-lg border flex justify-between items-center text-white/90 dark:text-white bg-black p-4 w-[500px]">
              <>{`https://formbase.dev/s/${formId}`}</>
              <CopyButton text={formId} className="text-white" />
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
