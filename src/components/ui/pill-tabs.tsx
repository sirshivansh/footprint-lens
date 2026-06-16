"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface TabOption {
  id: string;
  label: string;
}

export interface PillTabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillTabs({ options, activeId, onChange, className }: PillTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-soil/5 p-1 dark:bg-soil/10 border border-border-custom",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay",
              isActive ? "text-sand" : "text-soil/70 hover:text-soil dark:text-soil/80 dark:hover:text-soil"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 bg-soil rounded-full -z-10 dark:bg-soil"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
