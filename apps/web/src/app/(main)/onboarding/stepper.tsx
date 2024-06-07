import React from 'react';

// Custom components for each step
const StepOneContent = () => (
  <div>
    <p>This is custom content for step 1. Add your instructions here.</p>
    <code>npm install some-package</code>
  </div>
);

const StepTwoContent = () => (
  <div>
    <p>This is custom content for step 2. Add your code snippet here.</p>
    <pre>
      {`const example = 'Hello World';
console.log(example);`}
    </pre>
  </div>
);

const StepThreeContent = () => (
  <div>
    <p>This is custom content for step 3. Explain what to do next.</p>
  </div>
);

const steps = [
  { title: 'Add a new form endpoint', content: <StepOneContent /> },
  {
    title: 'Send a submission.',
    content: <StepTwoContent />,
  },
  {
    title: 'Waiting for submissions.',
    content: <StepThreeContent />,
  },
];

const Stepper = () => {
  return (
    <div>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-5 mb-10">
          <span className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs">
            {index + 1}
          </span>

          <div className="-mt-0.5">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <div className="text-gray-600 mt-2">{step.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
