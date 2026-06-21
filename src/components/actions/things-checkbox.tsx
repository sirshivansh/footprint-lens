"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ThingsCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
}

export function ThingsCheckbox({
  checked = false,
  onChange,
  disabled = false,
  size = 28,
  className,
}: ThingsCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(checked);
  const controls = useAnimation();

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card clicks
    if (disabled || internalChecked) return;
    
    setInternalChecked(true);

    // Play Things 3 checkbox spring bounce (Phase 3)
    await controls.start({
      scale: [1, 1.18, 0.95, 1],
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 15,
        duration: 0.35,
      },
    });

    if (onChange) {
      onChange(true);
    }
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      animate={controls}
      className={cn(
        "relative flex items-center justify-center rounded-full focus:outline-none transition-colors border",
        internalChecked
          ? "border-moss bg-moss text-sand"
          : "border-soil/25 hover:border-soil/55 bg-transparent text-transparent",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Phase 1: Background sweep element (120ms duration) */}
      {internalChecked && (
        <span className="absolute inset-0 rounded-full bg-moss animate-sweep" />
      )}

      {/* Phase 2: SVG Checkmark draws in (80ms duration after 120ms delay) */}
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <motion.path
          d="M5 12l5 5L19 7"
          initial={false}
          animate={{
            pathLength: internalChecked ? 1 : 0,
            opacity: internalChecked ? 1 : 0,
          }}
          transition={{
            pathLength: {
              delay: 0.12, // delay after color sweep (120ms)
              duration: 0.08, // draw in over 80ms
              ease: "easeOut",
            },
            opacity: {
              delay: 0.12,
              duration: 0.01,
            },
          }}
        />
      </svg>
    </motion.button>
  );
}
