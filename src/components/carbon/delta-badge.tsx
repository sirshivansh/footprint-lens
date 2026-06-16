import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

interface DeltaBadgeProps {
  percent: number; // e.g. -28.07 or +5.2
  className?: string;
}

export function DeltaBadge({ percent, className }: DeltaBadgeProps) {
  const isReduction = percent < 0;
  const absPercent = Math.abs(percent);

  if (percent === 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-muted/10 text-muted", className)}>
        No change
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans",
        isReduction
          ? "bg-moss/10 text-moss dark:bg-moss/25"
          : "bg-ember/10 text-ember dark:bg-ember/25",
        className
      )}
    >
      {isReduction ? (
        <ArrowDown className="h-3 w-3 stroke-[2.5]" />
      ) : (
        <ArrowUp className="h-3 w-3 stroke-[2.5]" />
      )}
      <span>{absPercent.toFixed(1)}%</span>
      <span className="text-[10px] opacity-80 font-normal">from last period</span>
    </span>
  );
}
