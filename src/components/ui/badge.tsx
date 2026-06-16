import React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "soil" | "moss" | "clay" | "sky" | "ash" | "ember";
}

export function Badge({ className, variant = "soil", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-clay";

  const variants = {
    soil: "bg-soil/10 text-soil dark:bg-soil/25",
    moss: "bg-moss/10 text-moss dark:bg-moss/25",
    clay: "bg-clay/10 text-clay dark:bg-clay/25",
    sky: "bg-sky/10 text-sky dark:bg-sky/25",
    ash: "bg-muted/10 text-muted dark:bg-muted/25",
    ember: "bg-ember/10 text-ember dark:bg-ember/25",
  };

  return <span className={cn(baseStyles, variants[variant], className)} {...props} />;
}
