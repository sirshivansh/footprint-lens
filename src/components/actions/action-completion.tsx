"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useUIStore } from "@/stores/ui-store";
import { formatCO2 } from "@/lib/format";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ActionCompletion() {
  const { showCelebration, celebrationData, dismissCelebration } = useUIStore();
  const prefersReduced = useReducedMotion();

  const launchConfetti = useCallback(() => {
    if (prefersReduced) return;

    // Green-themed confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#5B8C5A", "#7CB87B", "#C67B5C", "#FAF7F2"],
      disableForReducedMotion: true,
    });
  }, [prefersReduced]);

  useEffect(() => {
    if (showCelebration) {
      launchConfetti();

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(dismissCelebration, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, launchConfetti, dismissCelebration]);

  if (!celebrationData) return null;

  const formatted = formatCO2(celebrationData.co2eSaved);

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="fixed inset-x-4 bottom-24 md:bottom-8 md:right-8 md:left-auto md:w-96 z-50"
        >
          <div
            className="rounded-custom-card bg-moss/10 border border-moss/30 p-6 card-elevated-shadow text-center cursor-pointer"
            onClick={dismissCelebration}
            role="status"
            aria-live="polite"
          >
            {/* Celebration icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
              className="text-4xl mb-3"
            >
              🌱
            </motion.div>

            {/* Title */}
            <h3 className="font-serif text-xl font-bold text-moss mb-1">
              Nice work!
            </h3>

            {/* Action title */}
            <p className="text-sm text-soil font-sans mb-3">
              {celebrationData.actionTitle}
            </p>

            {/* CO₂ saved */}
            <div className="inline-flex items-baseline gap-1 bg-moss/10 rounded-custom-btn px-4 py-2">
              <span className="font-mono text-2xl font-black text-moss">
                -{formatted.value}
              </span>
              <span className="text-sm font-semibold text-moss/80">
                {formatted.unit} saved
              </span>
            </div>

            {/* Dismiss hint */}
            <p className="text-xs text-muted mt-3">Tap to dismiss</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
