"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASING } from "@/lib/constants";

export interface OnboardingStepProps {
  /** Current step number (1-indexed for display) */
  step: number;
  /** Total number of steps */
  totalSteps: number;
  /** Optional title above children */
  title?: string;
  /** Show back button */
  showBack?: boolean;
  /** Back handler */
  onBack?: () => void;
  /** Skip handler — every screen has a skip per UX rules */
  onSkip?: () => void;
  /** Skip label text */
  skipLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function OnboardingStep({
  step,
  totalSteps,
  title,
  showBack = false,
  onBack,
  onSkip,
  skipLabel = "Skip for now",
  children,
  className,
}: OnboardingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={EASING.spring}
      className={cn(
        "flex flex-col items-center justify-center w-full py-2",
        className
      )}
    >
      {/* Top bar: back + progress dots */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        {showBack && onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted hover:text-soil transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i + 1 === step
                  ? "bg-clay w-6"
                  : i + 1 < step
                    ? "bg-moss"
                    : "bg-soil/15 dark:bg-soil/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      {title && (
        <h2 className="font-serif text-2xl font-bold text-soil text-center mb-6 max-w-md">
          {title}
        </h2>
      )}

      {/* Content */}
      <div className="w-full max-w-md flex-1 flex flex-col">
        {children}
      </div>

      {/* Skip link */}
      {onSkip && (
        <div className="w-full max-w-md mt-6 text-center">
          <button
            onClick={onSkip}
            className="text-sm text-muted hover:text-soil transition-colors font-sans"
          >
            {skipLabel}
          </button>
        </div>
      )}
    </motion.div>
  );
}
