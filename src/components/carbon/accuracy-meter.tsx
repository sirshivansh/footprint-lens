"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/cn";

interface AccuracyMeterProps {
  score: number; // 0 to 100
  size?: number; // width/height in px
  strokeWidth?: number;
  className?: string;
}

export function AccuracyMeter({
  score,
  size = 180,
  strokeWidth = 12,
  className,
}: AccuracyMeterProps) {
  const [currentScore, setCurrentScore] = useState(0);

  // Circular math
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Motion values for spring counter
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // Animate the text counter and visual stroke offset
    const controls = animate(count, score, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], // ease-out-expo
      onUpdate: (latest) => setCurrentScore(Math.round(latest)),
    });
    return () => controls.stop();
  }, [score, count]);

  // Dash offset: circumference * (1 - currentScore / 100)
  const strokeDashoffset = circumference * (1 - currentScore / 100);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* SVG Circular Path */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          className="text-soil/10 dark:text-soil/20"
          strokeWidth={strokeWidth}
        />
        {/* Active progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#accuracyGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--clay)" />
            <stop offset="100%" stopColor="var(--moss)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centered value display */}
      <div className="flex flex-col items-center justify-center text-center select-none">
        <span className="font-mono text-4xl font-extrabold text-soil">
          {currentScore}%
        </span>
        <span className="text-[10px] font-bold tracking-widest text-muted uppercase font-sans mt-0.5">
          Accuracy
        </span>
      </div>
    </div>
  );
}
