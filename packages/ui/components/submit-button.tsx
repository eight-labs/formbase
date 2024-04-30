"use client";

import { forwardRef } from "react";
// TODO: remove, pass the useFormStatus hook to the LoadingButton component
// import { useFormStatus } from "react-dom";

import { LoadingButton } from "./loading-button";
import type { ButtonProps } from "../primitives/button";

const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    // const { pending } = useFormStatus();
    return (
      <LoadingButton ref={ref} {...props} className={className}>
        {children}
      </LoadingButton>
    );
  },
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
