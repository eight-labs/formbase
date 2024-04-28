"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { LoadingButton } from "src/components/loading-button";
import type { ButtonProps } from "src/components/ui/button";

const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { pending } = useFormStatus();
    return (
      <LoadingButton
        ref={ref}
        {...props}
        loading={pending}
        className={className}
      >
        {children}
      </LoadingButton>
    );
  },
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
