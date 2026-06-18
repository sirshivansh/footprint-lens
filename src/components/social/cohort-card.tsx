"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { AvatarGroup } from "./avatar";
import { cn } from "@/lib/cn";
import { EASING } from "@/lib/constants";

export interface CohortCardProps {
  cohort: {
    name: string;
    type: string;
    memberCount: number;
    members: {
      avatarColor: string;
      avatarShape: string;
      isYou?: boolean;
    }[];
    createdAt: string;
  };
  className?: string;
}

export function CohortCard({ cohort, className }: CohortCardProps) {
  const formattedDate = new Date(cohort.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const yourAvatar = cohort.members.find((m) => m.isYou);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={EASING.spring}
    >
      <Card className={cn("border-border-custom", className)}>
        <CardHeader className="pb-2">
          <span className="text-xs font-bold tracking-widest text-muted uppercase font-sans">
            🌳 Your Cohort
          </span>
          <CardTitle className="text-lg">{cohort.name}</CardTitle>
          <p className="text-xs text-muted font-sans">
            {cohort.memberCount} members · Formed {formattedDate}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Avatar row */}
          <div className="flex flex-col items-center gap-3 p-4 rounded-custom-btn bg-soil/3 dark:bg-soil/5">
            <AvatarGroup members={cohort.members} size="md" />
            {yourAvatar && (
              <p className="text-xs text-muted font-sans">
                You are the{" "}
                <span
                  className="font-bold"
                  style={{ color: yourAvatar.avatarColor }}
                >
                  {getColorName(yourAvatar.avatarColor)}
                </span>
                {" "}one
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Map hex colors to friendly names
function getColorName(hex: string): string {
  const colorNames: Record<string, string> = {
    "#5B8C5A": "moss-green",
    "#7CB87B": "moss-green",
    "#C67B5C": "terracotta",
    "#D48B6E": "terracotta",
    "#7BA7BC": "sky-blue",
    "#9DC4D4": "sky-blue",
    "#D95D39": "ember",
    "#E07151": "ember",
    "#8B8680": "stone",
    "#A39D97": "stone",
  };
  return colorNames[hex.toUpperCase()] || colorNames[hex] || "colorful";
}
