"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  color?: "moss" | "clay" | "soil";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "moss",
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const colors = {
    moss: "bg-moss",
    clay: "bg-clay",
    soil: "bg-soil",
  };

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-soil/10 dark:bg-soil/20",
        heights[size],
        className
      )}
    >
      <motion.div
        className={cn("h-full rounded-full", colors[color])}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      />
    </div>
  );
}
