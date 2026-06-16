import React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-custom-input border border-border-custom bg-surface px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-ember focus-visible:ring-ember" : "",
            className
          )}
          {...props}
        />
        {error && (
          <span className="mt-1 block text-xs font-semibold text-ember font-sans">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
