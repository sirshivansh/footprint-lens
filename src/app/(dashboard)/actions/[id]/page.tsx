"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, Button, Skeleton } from "@/components/ui";
import { useUIStore } from "@/stores/ui-store";
import { ArrowLeft, Sparkles, Trophy, ShieldAlert, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function ActionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const addToast = useUIStore((s) => s.addToast);
  const utils = trpc.useUtils();

  const { data: action, isLoading } = trpc.actions.getById.useQuery({ id });
  const completeMutation = trpc.actions.complete.useMutation();
  const dismissMutation = trpc.actions.dismiss.useMutation();

  const [celebrateMsg, setCelebrateMsg] = useState("");

  const handleComplete = async () => {
    if (!action) return;
    try {
      const co2eSaved = parseFloat(action.estimatedCo2eReductionKg || "0");
      await completeMutation.mutateAsync({
        actionId: action.id,
        actualCo2eSavedKg: co2eSaved,
      });

      // Blast confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#5B8C5A", "#C67B5C", "#7BA7BC"],
      });

      setCelebrateMsg(`Fantastic! You avoided ${co2eSaved.toFixed(1)} kg of CO₂e!`);

      // Invalidate queries and navigate back
      setTimeout(() => {
        utils.actions.getCurrent.invalidate();
        utils.actions.getTiers.invalidate();
        utils.carbon.getSummary.invalidate();
        addToast({
          type: "success",
          title: "Action Recorded",
          description: `Successfully completed: ${action.title}`,
        });
        router.push("/actions");
      }, 2500);
    } catch (err) {
      console.error("Failed to complete action:", err);
      addToast({
        type: "error",
        title: "Submission Error",
        description: "Failed to record your completed swap. Please try again.",
      });
    }
  };

  const handleDismiss = async () => {
    if (!action) return;
    try {
      await dismissMutation.mutateAsync({ actionId: action.id });
      addToast({
        type: "info",
        title: "Action Skipped",
        description: "We'll suggest another carbon swap for your queue.",
      });
      router.push("/actions");
    } catch (err) {
      console.error("Failed to skip action:", err);
    }
  };

  if (isLoading) {
    return (
      <PageShell maxWidth="sm">
        <Skeleton className="h-96 w-full rounded-custom-card animate-pulse" />
      </PageShell>
    );
  }

  if (!action) {
    return (
      <PageShell maxWidth="sm">
        <Card className="p-8 border-border-custom bg-surface text-center flex flex-col items-center gap-4 font-sans text-left">
          <ShieldAlert className="h-10 w-10 text-ember" />
          <h3 className="font-serif text-lg font-bold text-soil">Action Not Found</h3>
          <p className="text-sm text-muted">The carbon swap action you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/actions")} className="w-full">
            BACK TO COACH
          </Button>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="sm">
      <div className="flex flex-col gap-6 font-sans text-left">
        {/* Navigation Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/actions")}
            className="h-9 w-9 p-0 flex items-center justify-center rounded-custom-btn border-border-custom"
            aria-label="Back to coach"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-soil" />
          </Button>
          <div className="flex flex-col">
            <h2 className="font-serif text-2xl font-bold text-soil">Carbon Swap Detail</h2>
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
              {action.category} swap
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {celebrateMsg ? (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-moss/30 bg-moss/5 text-center p-8 flex flex-col items-center justify-center gap-4 min-h-80 shadow-inner">
                <div className="h-16 w-16 rounded-full bg-moss text-sand flex items-center justify-center shadow-md animate-bounce">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <div className="flex flex-col gap-2 max-w-xs">
                  <h3 className="font-serif text-2xl font-bold text-soil">Action Complete!</h3>
                  <p className="text-sm text-muted leading-relaxed">{celebrateMsg}</p>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border border-border-custom bg-surface relative overflow-hidden shadow-md">
                {/* Top Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-clay/15 text-clay px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{parseFloat(action.estimatedCo2eReductionKg || "0").toFixed(1)} kg avoided</span>
                </div>

                <div className="p-6 flex flex-col gap-5 pt-12">
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className="text-[10px] font-bold tracking-widest text-muted uppercase">
                      Category: {action.category}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-soil leading-tight">
                      {action.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted leading-relaxed">
                    {action.description}
                  </p>

                  {action.impactDescription && (
                    <div className="rounded-custom-btn bg-soil/5 dark:bg-soil/15 p-4 text-xs text-soil/95 leading-relaxed border-l-2 border-clay font-medium italic">
                      {action.impactDescription}
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 p-3 bg-moss/5 border border-moss/10 rounded-custom-btn text-left mt-2">
                    <Trophy className="h-5 w-5 text-moss shrink-0" />
                    <span className="text-xs text-muted leading-relaxed">
                      Completing this action registers <strong>{action.estimatedCo2eReductionKg || "0"} kg</strong> to your forestation credits. Earn 1 Living Tree for every 100 kg reduced!
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 pt-3">
                    <Button
                      onClick={handleComplete}
                      isLoading={completeMutation.isPending}
                      variant="accent"
                      className="w-full font-bold h-11"
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
                        Skip for now
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
