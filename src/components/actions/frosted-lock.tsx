"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface FrostedLockProps {
  message: string;
  className?: string;
}

/**
 * Frosted glass overlay for locked content.
 * Creates curiosity, not frustration — per UX spec.
 */
export function FrostedLock({ message, className }: FrostedLockProps) {
  return (
    <div
      className={cn(
        "frosted-glass rounded-custom-btn p-6 flex flex-col items-center justify-center gap-2 text-center",
        className
      )}
      role="status"
      aria-label={message}
    >
      <span className="text-2xl" role="img" aria-hidden="true">
        🔒
      </span>
      <p className="text-sm font-semibold text-soil/70 dark:text-soil/70 font-sans leading-snug">
        {message}
      </p>
    </div>
  );
}
