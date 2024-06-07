import { api } from '~/lib/trpc/server';

import { CodeExampleStep } from './form/code-example-step';
import { CreateFormStep } from './form/create-form-step';

const Stepper = async () => {
  const onboardingForm = await api.form.getOnboardingForm();
  const form = onboardingForm[0]?.formId;

  const steps = [
    {
      content: <CreateFormStep formId={form ?? null} />,
    },
    {
      content: <CodeExampleStep formId={form ?? null} />,
    },
  ];

  return (
    <div>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-5 mb-10">
          <span className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs">
            {index + 1}
          </span>

          {step.content}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
