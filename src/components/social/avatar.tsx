"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface AvatarProps {
  color: string;
  shape?: string;
  isYou?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Organic SVG blob paths — unique shapes for each avatar
const BLOB_PATHS = [
  "M45.4,-51.8C57.3,-42.3,64.6,-27.1,67.2,-10.8C69.8,5.5,67.8,22.9,59.4,35.9C51,48.9,36.2,57.5,20.2,61.4C4.2,65.3,-13,64.6,-27.5,58.1C-42,51.6,-53.8,39.3,-60.1,24.5C-66.4,9.7,-67.2,-7.6,-61.8,-22.1C-56.4,-36.6,-44.8,-48.3,-31.7,-57.3C-18.6,-66.3,-4.1,-72.6,7.3,-81C18.7,-89.4,33.5,-61.3,45.4,-51.8Z",
  "M38.9,-47.3C49.2,-37.7,55.8,-24.2,59.1,-9.3C62.4,5.6,62.4,21.8,55.2,33.8C48,45.8,33.6,53.6,18.3,57.7C3,61.8,-13.2,62.2,-27.2,56.4C-41.2,50.6,-53,38.6,-58.8,24.3C-64.6,10,-64.4,-6.6,-58.8,-20.3C-53.2,-34,-42.2,-44.8,-30,-53.1C-17.8,-61.4,-4.3,-67.2,6,-63.4C16.3,-59.6,28.6,-56.9,38.9,-47.3Z",
  "M42.7,-53.1C53.4,-41.7,59.1,-26.7,62.2,-10.8C65.3,5.1,65.8,21.9,58.5,34.6C51.2,47.3,36.1,55.9,20.1,60.3C4.1,64.7,-12.8,64.9,-27.1,59C-41.4,53.1,-53.1,41.1,-59.7,26.8C-66.3,12.5,-67.8,-4.1,-63.2,-18.7C-58.6,-33.3,-47.9,-45.9,-35.2,-56.8C-22.5,-67.7,-7.9,-76.9,4.6,-82.6C17.1,-88.3,32,-64.5,42.7,-53.1Z",
  "M44.1,-49.6C55.5,-40.6,62.4,-25.2,64.5,-9.2C66.6,6.8,63.9,23.4,55.2,35.6C46.5,47.8,31.8,55.6,15.9,60.1C0,64.6,-17.1,65.8,-31.6,59.8C-46.1,53.8,-58,40.6,-63.3,25.4C-68.6,10.2,-67.3,-7,-60.4,-20.8C-53.5,-34.6,-41,-45,-27.8,-53.3C-14.6,-61.6,-0.7,-67.8,9.8,-65.1C20.3,-62.4,32.7,-58.6,44.1,-49.6Z",
  "M39.7,-46.1C52.2,-36.8,63.7,-24.8,67.2,-10.5C70.7,3.8,66.2,20.4,56.4,32.4C46.6,44.4,31.5,51.8,15.7,56.5C-0.1,61.2,-16.6,63.2,-30.7,57.6C-44.8,52,-56.5,38.8,-62.1,23.4C-67.7,8,-67.2,-9.6,-60.7,-23.8C-54.2,-38,-41.7,-48.8,-28.4,-57.8C-15.1,-66.8,-1,-74,8.1,-66.6C17.2,-59.2,27.2,-55.4,39.7,-46.1Z",
];

/**
 * Abstract organic blob avatar — no photos, per design spec.
 * Colors are assigned randomly to cohort members for anonymity.
 */
export function Avatar({ color, shape, isYou = false, size = "md", className }: AvatarProps) {
  // Pick a blob path based on shape string hash
  const blobIndex = shape
    ? Math.abs(shape.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % BLOB_PATHS.length
    : 0;

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0",
        sizes[size],
        isYou && "ring-2 ring-moss ring-offset-2 ring-offset-surface rounded-full",
        className
      )}
      title={isYou ? "This is you" : "Cohort member"}
    >
      <svg
        viewBox="-80 -80 160 160"
        className="w-full h-full"
        aria-hidden="true"
      >
        <path
          d={BLOB_PATHS[blobIndex]}
          fill={color}
          opacity={0.85}
          transform="translate(0,0)"
        />
      </svg>
      {isYou && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-moss rounded-full border-2 border-surface" />
      )}
    </div>
  );
}

/**
 * Avatar group — displays a row of overlapping avatars.
 */
export interface AvatarGroupProps {
  members: {
    avatarColor: string;
    avatarShape: string;
    isYou?: boolean;
  }[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({ members, maxVisible = 6, size = "md", className }: AvatarGroupProps) {
  const visible = members.slice(0, maxVisible);
  const overflow = members.length - maxVisible;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((member, i) => (
        <Avatar
          key={i}
          color={member.avatarColor}
          shape={member.avatarShape}
          isYou={member.isYou}
          size={size}
        />
      ))}
      {overflow > 0 && (
        <div className="w-10 h-10 rounded-full bg-soil/10 dark:bg-soil/15 flex items-center justify-center text-xs font-bold text-muted">
          +{overflow}
        </div>
      )}
    </div>
  );
}
