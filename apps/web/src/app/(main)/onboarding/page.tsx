import React from 'react';

import Stepper from './stepper';

export default function OnboardingPage() {
  return (
    <div className="container pt-10 md:flex-row md:px-4 lg:gap-10">
      <div className="mb-10 flex w-full items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-medium">
            Recieve your first submission
          </h1>
          <p className="text-sm mt-1.5 text-muted-foreground">
            Follow these steps to get your first form submission
          </p>
        </div>
      </div>

      <Stepper />
    </div>
  );
}
