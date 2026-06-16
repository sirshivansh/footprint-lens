"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const MotionButton = motion.button as any;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-semibold rounded-custom-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary: "bg-soil text-sand hover:bg-soil/95 active:bg-soil/90 dark:bg-soil dark:text-sand dark:hover:bg-soil/90",
      accent: "bg-moss text-sand hover:bg-moss/95 active:bg-moss/90 dark:bg-moss dark:text-sand dark:hover:bg-moss/90",
      secondary: "bg-clay text-sand hover:bg-clay/95 active:bg-clay/90 dark:bg-clay dark:text-sand dark:hover:bg-clay/90",
      outline: "border border-border-custom bg-transparent text-soil hover:bg-soil/5 dark:text-soil dark:hover:bg-soil/5",
      ghost: "bg-transparent text-soil hover:bg-soil/5 dark:text-soil dark:hover:bg-soil/5",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-5 text-base",
      lg: "h-13 px-7 text-lg",
    };

    return (
      <MotionButton
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
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
      </MotionButton>
    );
  }
);

Button.displayName = "Button";
