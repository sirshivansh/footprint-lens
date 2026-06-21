"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-extrabold rounded-custom-btn transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay disabled:pointer-events-none disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none";

    const variants = {
      primary: "bg-soil text-sand border-[3px] border-soil shadow-[3px_3px_0px_0px_rgba(44,38,64,0.4)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(44,38,64,0.4)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]",
      accent: "bg-moss text-soil border-[3px] border-soil shadow-[3px_3px_0px_0px_var(--soil)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--soil)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
      secondary: "bg-clay text-sand border-[3px] border-soil shadow-[3px_3px_0px_0px_var(--soil)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--soil)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
      outline: "border-[3px] border-soil bg-transparent text-soil shadow-[3px_3px_0px_0px_var(--soil)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--soil)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-soil/5",
      ghost: "bg-transparent text-soil border-[3px] border-transparent hover:bg-soil/5 active:translate-x-[1px] active:translate-y-[1px]",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-5 text-base",
      lg: "h-13 px-7 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
