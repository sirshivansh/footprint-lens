"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, Button, Skeleton } from "@/components/ui";
import { Sparkles, X, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export function ActionCard() {
  const utils = trpc.useUtils();
  const { data: action, isLoading, refetch } = trpc.actions.getCurrent.useQuery();
  const completeMutation = trpc.actions.complete.useMutation();
  const dismissMutation = trpc.actions.dismiss.useMutation();

  const [celebrateMsg, setCelebrateMsg] = useState("");

  const handleComplete = async () => {
    if (!action) return;
    try {
      const result = await completeMutation.mutateAsync({
        actionId: action.id,
        actualCo2eSavedKg: action.estimatedCo2eReductionKg,
      });

      // Trigger standard confetti blast
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#5B8C5A", "#C67B5C", "#7BA7BC"], // Moss, Clay, Sky
      });

      setCelebrateMsg(`Nice work! Swiped ${action.estimatedCo2eReductionKg.toFixed(1)} kg CO₂e saved.`);
      
      // Invalidations
      setTimeout(() => {
        setCelebrateMsg("");
        utils.actions.getCurrent.invalidate();
        utils.actions.getTiers.invalidate();
        utils.carbon.getSummary.invalidate();
      }, 3000);
    } catch (err) {
      console.error("Failed to complete action:", err);
    }
  };

  const handleDismiss = async () => {
    if (!action) return;
    try {
      await dismissMutation.mutateAsync({ actionId: action.id });
      utils.actions.getCurrent.invalidate();
    } catch (err) {
      console.error("Failed to skip action:", err);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-custom-card" />;
  }

  if (!action) {
    return (
      <Card className="p-6 border-border-custom bg-surface text-center">
        <p className="text-sm text-muted">You've swiped all available actions! Check back tomorrow or unlock higher tiers.</p>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {celebrateMsg ? (
        <motion.div
          key="celebrate"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full"
        >
          <Card className="border-moss/30 bg-moss/5 text-center p-8 flex flex-col items-center justify-center gap-4 min-h-64 shadow-inner">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="h-14 w-14 rounded-full bg-moss text-sand flex items-center justify-center shadow-md"
            >
              <Check className="h-6 w-6 stroke-[3]" />
            </motion.div>
            <div className="flex flex-col gap-1 max-w-xs">
              <h3 className="font-serif text-xl font-bold text-soil">Swapped!</h3>
              <p className="text-sm text-muted leading-relaxed">{celebrateMsg}</p>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full"
        >
          <Card className="border-border-custom bg-surface relative overflow-hidden shadow-md font-sans">
            {/* Top Tag */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-clay/15 text-clay px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TODAY'S ACTION</span>
            </div>

            <div className="p-6 flex flex-col gap-4 pt-10">
              {/* Category & Title */}
              <div className="flex flex-col gap-1.5 items-start">
                <span className="text-[10px] font-bold tracking-widest text-muted uppercase">
                  {action.tier?.name} · {action.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-soil leading-tight">
                  {action.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-muted leading-relaxed">
                {action.description}
              </p>

              {/* Impact Callout */}
              {action.impactDescription && (
                <div className="rounded-custom-btn bg-soil/5 dark:bg-soil/15 p-4 text-xs text-soil/95 leading-relaxed border-l-2 border-clay font-medium italic">
                  {action.impactDescription}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleComplete}
                  isLoading={completeMutation.isPending}
                  variant="accent"
                  className="w-full font-bold shadow-sm"
                >
                  I DID THIS ✓
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-muted">
                  <button
                    onClick={handleDismiss}
                    className="hover:text-soil transition-colors cursor-pointer"
                  >
                    Not today
                  </button>
                  <span>·</span>
                  <button
                    onClick={handleDismiss}
                    className="hover:text-soil transition-colors cursor-pointer"
                  >
                    Show me another
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
