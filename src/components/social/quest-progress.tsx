"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, ProgressBar } from "@/components/ui";
import { AvatarGroup } from "./avatar";
import { cn } from "@/lib/cn";
import { EASING } from "@/lib/constants";
import { formatCO2 } from "@/lib/format";

export interface QuestProgressProps {
  quest: {
    title: string;
    type: string;
    targetCo2eKg: number;
    currentCo2eKg: number;
    status: string;
    startDate: string;
    endDate: string;
  };
  className?: string;
}

export function QuestProgress({ quest, className }: QuestProgressProps) {
  const progressPercent = quest.targetCo2eKg > 0
    ? Math.min(100, (quest.currentCo2eKg / quest.targetCo2eKg) * 100)
    : 0;

  const remaining = Math.max(0, quest.targetCo2eKg - quest.currentCo2eKg);
  const remainingFormatted = formatCO2(remaining);

  const endDate = new Date(quest.endDate);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86400000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={EASING.spring}
    >
      <Card className={cn("border-border-custom", className)}>
        <CardHeader className="pb-2">
          <span className="text-xs font-bold tracking-widest text-muted uppercase font-sans">
            🎯 Current Quest
          </span>
          <CardTitle className="text-base">
            &ldquo;{quest.title}&rdquo;
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Progress bar */}
          <div className="flex flex-col gap-2">
            <ProgressBar value={progressPercent} className="h-3" />
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-moss">{progressPercent.toFixed(0)}%</span>
              <span className="text-muted">{daysLeft} days left</span>
            </div>
          </div>

          {/* Quest map visualization (abstract) */}
          <div className="relative h-20 rounded-custom-btn bg-moss/5 dark:bg-moss/10 overflow-hidden">
            {/* Filled portion */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-moss/10 dark:bg-moss/15"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Tree icons representing progress */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl opacity-60" role="img" aria-hidden="true">
                {progressPercent >= 75 ? "🌲🌳🌲🌳" : progressPercent >= 50 ? "🌲🌳🌲" : progressPercent >= 25 ? "🌲🌳" : "🌱"}
              </span>
            </div>
          </div>

          {/* Remaining message */}
          <p className="text-sm text-muted font-sans text-center">
            <span className="font-mono font-bold text-soil">{remainingFormatted.value} {remainingFormatted.unit}</span>
            {" "}more to fully sustain the park this month
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
