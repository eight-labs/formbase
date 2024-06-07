import { api } from '~/lib/trpc/server';

import { CodeExampleStep } from './form/code-example-step';
import { CreateFormStep } from './form/create-form-step';

const Stepper = async () => {
  const onboardingForm = await api.form.getOnboardingForm();
  const form = onboardingForm[0];

  const steps = [
    {
      title: 'Add a new form endpoint',
      content: <CreateFormStep formId={form?.id ?? null} />,
    },
    {
      title: 'Send a submission.',
      content: <CodeExampleStep formId={form?.id ?? null} />,
    },
  ];

  return (
    <div>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-5 mb-10">
          <span className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs">
            {index + 1}
          </span>

          <div className="-mt-0.5">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <div className="text-gray-600 dark:text-muted-foreground mt-2">
              {step.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
