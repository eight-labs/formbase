import { cn } from '@formbase/ui/utils/cn';

import { api } from '~/lib/trpc/server';

import { CodeExampleStep } from './form/code-example-step';
import { CreateFormStep } from './form/create-form-step';

const Stepper = async () => {
  const onboardingForm = await api.form.getOnboardingForm();
  const form = onboardingForm[0]?.formId;
  const formId = form ?? null;

  const steps = [
    {
      content: <CreateFormStep formId={formId} />,
    },
    {
      content: <CodeExampleStep formId={formId} />,
    },
  ];

  return (
    <div>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-5 mb-10">
          <span
            className={cn(
              'w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs',
              {
                'pointer-events-none opacity-50 select-none':
                  index === 1 && formId === null,
              },
            )}
          >
            {index + 1}
          </span>

          {step.content}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
