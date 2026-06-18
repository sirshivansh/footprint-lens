"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { EASING } from "@/lib/constants";

export interface RippleNotificationProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Ripple notification — a gentle, informational nudge from the cohort.
 * "Your cohort is 73% to this week's goal. 2 members made swaps today."
 * Informational, not actionable — it pulls, never pushes.
 */
export function RippleNotification({ message, visible, onDismiss, className }: RippleNotificationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={EASING.spring}
          className={cn(
            "rounded-custom-btn bg-sky/8 dark:bg-sky/12 border border-sky/20 p-4 cursor-pointer",
            className
          )}
          onClick={onDismiss}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {/* Ripple icon with animation */}
            <div className="relative shrink-0 mt-0.5">
              <span className="text-lg" role="img" aria-hidden="true">
                🌊
              </span>
              {/* Animated ripple ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-sky/40"
                animate={{
                  scale: [1, 1.8, 2.2],
                  opacity: [0.6, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold tracking-widest text-sky uppercase font-sans block mb-1">
                Cohort Ripple
              </span>
              <p className="text-sm text-soil font-sans leading-snug">
                {message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
