"use client";

import { forwardRef } from "react";

import type { ButtonProps } from "@formbase/ui/primitives/button";

import { LoadingButton } from "./loading-button";

const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <LoadingButton ref={ref} {...props} className={className}>
        {children}
      </LoadingButton>
    );
  },
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
