"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { EASING } from "@/lib/constants";

export interface ForestTreeProps {
  species: string;
  reductionCategory: string;
  positionX?: number;
  positionY?: number;
  isMilestone?: boolean;
  wildlifeUnlocked?: string | null;
  index?: number;
  className?: string;
}

// Tree species → emoji/SVG mapping
const TREE_EMOJI: Record<string, string> = {
  birch: "🌳",
  oak: "🌳",
  pine: "🌲",
  maple: "🍁",
  cherry: "🌸",
  default: "🌳",
};

const WILDLIFE_EMOJI: Record<string, string> = {
  fox: "🦊",
  deer: "🦌",
  eagle: "🦅",
  rabbit: "🐇",
  owl: "🦉",
};

// Category → tree color tints
const CATEGORY_COLORS: Record<string, string> = {
  transport: "hue-rotate-[200deg]",
  diet: "hue-rotate-0",
  energy: "hue-rotate-[40deg]",
  shopping: "hue-rotate-[280deg]",
};

export function ForestTree({
  species,
  reductionCategory,
  isMilestone = false,
  wildlifeUnlocked,
  index = 0,
  className,
}: ForestTreeProps) {
  const treeEmoji = TREE_EMOJI[species] || TREE_EMOJI.default;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: index * 0.08,
      }}
      className={cn(
        "relative inline-flex flex-col items-center",
        isMilestone && "z-10",
        className
      )}
    >
      {/* Tree */}
      <span
        className={cn(
          "text-2xl md:text-3xl transition-transform hover:scale-110",
          isMilestone && "text-4xl"
        )}
        role="img"
        aria-label={`${species} tree from ${reductionCategory} reductions`}
      >
        {treeEmoji}
      </span>

      {/* Wildlife companion */}
      {wildlifeUnlocked && (
        <motion.span
          initial={{ scale: 0, y: 5 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: index * 0.08 + 0.3, type: "spring", stiffness: 500, damping: 20 }}
          className="text-lg absolute -bottom-1 -right-1"
          role="img"
          aria-label={`${wildlifeUnlocked} wildlife unlocked`}
        >
          {WILDLIFE_EMOJI[wildlifeUnlocked] || "🐾"}
        </motion.span>
      )}

      {/* Milestone glow */}
      {isMilestone && (
        <motion.div
          className="absolute inset-0 rounded-full bg-moss/20 blur-xl -z-10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
