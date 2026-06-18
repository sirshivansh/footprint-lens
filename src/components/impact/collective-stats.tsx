"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { EASING, ANIMATION } from "@/lib/constants";

interface StatItem {
  label: string;
  value: number;
  unit: string;
  icon?: string;
}

export interface CollectiveStatsProps {
  stats: StatItem[];
  personalContribution?: string;
  className?: string;
}

export function CollectiveStats({ stats, personalContribution, className }: CollectiveStatsProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Stats grid */}
      <div className={cn("grid gap-3", stats.length === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3")}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * ANIMATION.staggerDelay / 1000, ...EASING.spring }}
            className="flex flex-col items-center gap-1 p-4 rounded-custom-btn bg-surface border border-border-custom card-shadow text-center"
          >
            {stat.icon && (
              <span className="text-lg" role="img" aria-hidden="true">
                {stat.icon}
              </span>
            )}
            <span className="font-mono text-2xl font-black text-soil leading-none">
              {formatNumber(stat.value, stat.value < 10 ? 1 : 0)}
            </span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wide leading-tight">
              {stat.unit}
              <br />
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Personal contribution note */}
      {personalContribution && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted text-center font-sans"
        >
          Your personal contribution:{" "}
          <span className="font-semibold text-soil">{personalContribution}</span>
        </motion.p>
      )}
    </div>
  );
}
