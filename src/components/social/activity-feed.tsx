"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/lib/format";
import { EASING, ANIMATION } from "@/lib/constants";
import { Avatar } from "./avatar";

interface FeedItem {
  id: string;
  description: string;
  co2eSavedKg?: number;
  type: "action" | "milestone" | "quest";
  timestamp: string;
  avatarColor?: string;
  avatarShape?: string;
}

export interface ActivityFeedProps {
  items: FeedItem[];
  className?: string;
}

const typeColors = {
  action: "bg-moss",
  milestone: "bg-sky",
  quest: "bg-clay",
};

const typeEmoji = {
  action: "🟢",
  milestone: "🔵",
  quest: "🟡",
};

/**
 * Anonymous activity feed — "Someone did X", not "Sarah did X".
 * Maintains social proof without social surveillance.
 */
export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * ANIMATION.staggerDelay / 1000, ...EASING.spring }}
          className="flex gap-3 py-3 border-b border-border-custom/30 last:border-b-0"
        >
          {/* Timeline dot or Avatar */}
          <div className="flex flex-col items-center pt-0.5 shrink-0">
            {item.avatarColor && item.avatarShape ? (
              <Avatar color={item.avatarColor} shape={item.avatarShape} size="sm" />
            ) : (
              <span className="text-sm" role="img" aria-hidden="true">
                {typeEmoji[item.type]}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm text-soil font-sans leading-snug">
              {!item.description.startsWith("Someone") && (
                <span className="font-semibold">Someone </span>
              )}
              {item.description}
              {item.co2eSavedKg && item.co2eSavedKg > 0 && (
                <span className="font-mono text-moss font-bold">
                  {" · "}{item.co2eSavedKg.toFixed(1)} kg saved
                </span>
              )}
            </p>
            <span className="text-xs text-muted mt-0.5 block">
              {formatRelativeTime(item.timestamp)}
            </span>
          </div>
        </motion.div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-sm text-muted">
          No activity yet. Be the first to make a swap! 🌱
        </div>
      )}
    </div>
  );
}
