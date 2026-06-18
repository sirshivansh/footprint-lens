"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { EQUIVALENCE_ICONS, EASING } from "@/lib/constants";
import type { EquivalenceDetail } from "@/server/services/equivalence-engine";

export interface EquivalenceCardProps {
  equivalence: EquivalenceDetail;
  index?: number;
  className?: string;
}

export function EquivalenceCard({ equivalence, index = 0, className }: EquivalenceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const icon = EQUIVALENCE_ICONS[equivalence.type] || "🌍";

  // Descriptions for detail view
  const descriptions: Record<string, string> = {
    balloons: "If you inflated a standard party balloon with the CO₂ from your footprint, this is how many you'd have.",
    arctic_ice: "The amount of Arctic sea ice that will melt due to warming from this CO₂ release.",
    trees: "How many mature trees would need to work for an entire year to absorb this amount of carbon.",
    shower_hours: "The CO₂ equivalent of heating water for this many hours of hot showering.",
    miles_driven: "The distance you could drive in an average car producing the same carbon emissions.",
    cheese_blocks: "The number of 1kg blocks of dairy cheese whose production emits this amount of CO₂.",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ...EASING.spring }}
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "w-full text-left rounded-custom-btn bg-surface border border-border-custom p-4",
        "hover:border-moss/30 transition-colors cursor-pointer card-shadow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay",
        className
      )}
      aria-expanded={expanded}
      aria-label={`${equivalence.label}. Tap for more details.`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <span className="text-2xl shrink-0" role="img" aria-hidden="true">
          {icon}
        </span>

        {/* Value & Label */}
        <div className="flex-1 min-w-0">
          <span className="font-mono text-lg font-bold text-soil block">
            {equivalence.value.toLocaleString()}
            {equivalence.unit && (
              <span className="text-sm font-semibold text-muted ml-1">{equivalence.unit}</span>
            )}
          </span>
          <span className="text-sm text-muted font-sans">
            {equivalence.label.replace(/^[\d,.]+\s*/, "").replace(/^(sq ft of |hours of |miles |beef |party )?/, "")}
          </span>
        </div>

        {/* Expand indicator */}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted text-xs shrink-0"
        >
          ▼
        </motion.span>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-muted leading-relaxed mt-3 pt-3 border-t border-border-custom/50">
              {descriptions[equivalence.type] || "A physical equivalence of your carbon footprint."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Equivalence Grid ───

export interface EquivalenceGridProps {
  equivalences: EquivalenceDetail[];
  initialCount?: number;
  className?: string;
}

export function EquivalenceGrid({ equivalences, initialCount = 5, className }: EquivalenceGridProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? equivalences : equivalences.slice(0, initialCount);
  const remaining = equivalences.length - initialCount;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {visible.map((eq, i) => (
        <EquivalenceCard key={eq.type} equivalence={eq} index={i} />
      ))}

      {!showAll && remaining > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm font-semibold text-clay hover:text-clay/80 transition-colors py-2 text-center"
        >
          + See {remaining} more equivalences
        </button>
      )}
    </div>
  );
}
