"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, ProgressBar } from "@/components/ui";
import { FrostedLock } from "./frosted-lock";
import { cn } from "@/lib/cn";
import { EASING } from "@/lib/constants";

export interface TierCardProps {
  name: string;
  level: number;
  icon: string;
  color: string;
  status: "unlocked" | "locked";
  completed: number;
  total: number;
  unlockMessage?: string;
  actions?: {
    title: string;
    completed: boolean;
  }[];
  onViewAction?: () => void;
  className?: string;
}

export function TierCard({
  name,
  level,
  icon,
  color,
  status,
  completed,
  total,
  unlockMessage,
  actions = [],
  onViewAction,
  className,
}: TierCardProps) {
  const isLocked = status === "locked";
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level * 0.1, ...EASING.spring }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">
                {icon}
              </span>
              <CardTitle className="text-base uppercase tracking-wide font-sans font-bold">
                {name}
              </CardTitle>
            </div>
            {!isLocked && (
              <span className="text-xs font-mono font-bold text-muted">
                {completed}/{total} done
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {!isLocked && (
            <>
              {/* Progress bar */}
              <ProgressBar
                value={progressPercent}
                className="h-2"
                color="moss"
              />

              {/* Action list */}
              {actions.length > 0 && (
                <ul className="flex flex-col gap-1.5 mt-2">
                  {actions.map((action, i) => (
                    <li
                      key={i}
                      className={cn(
                        "text-sm font-sans flex items-center gap-2",
                        action.completed
                          ? "text-muted line-through"
                          : "text-soil"
                      )}
                    >
                      <span className="shrink-0">
                        {action.completed ? "✓" : "○"}
                      </span>
                      {action.title}
                    </li>
                  ))}
                </ul>
              )}

              {/* View current action CTA */}
              {onViewAction && (
                <button
                  onClick={onViewAction}
                  className="w-full mt-2 h-11 rounded-custom-btn bg-soil text-sand font-semibold text-sm hover:bg-soil/95 transition-colors"
                >
                  VIEW CURRENT ACTION
                </button>
              )}
            </>
          )}

          {/* Locked overlay */}
          {isLocked && (
            <FrostedLock
              message={unlockMessage || `Complete more actions to unlock ${name}`}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
