'use client';

import React, { useTransition } from 'react';

import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@formbase/ui/primitives/button';

type SendFormSubmissionButton = {
  formId: string | null;
};

export default function SendFormSubmissionButton({
  formId,
}: SendFormSubmissionButton) {
  const [isSubmittingForm, startFormSubmitTransition] = useTransition();

  const handleFormSubmission = () => {
    startFormSubmitTransition(async () => {
      await fetch(`/s/${formId}`, {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello, welcome to formbase',
        }),
      });

      toast.success('Form submission sent!');
    });
  };
  return (
    <Button
      onClick={handleFormSubmission}
      className="flex items-center gap-1"
      loading={isSubmittingForm}
      disabled={!formId}
    >
      {!isSubmittingForm && <Send className="w-4 h-4" />}
      <span>Send a submission</span>
    </Button>
  );
}
