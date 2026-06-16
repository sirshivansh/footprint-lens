"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ActionCard } from "@/components/actions/action-card";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui";
import { Lock, Unlock, ShieldAlert, CheckCircle2, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function ActionsPage() {
  const { data: tiers, isLoading: isTiersLoading } = trpc.actions.getTiers.useQuery();

  if (isTiersLoading) {
    return (
      <PageShell maxWidth="md">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64 w-full rounded-custom-card" />
          <Skeleton className="h-48 w-full rounded-custom-card" />
        </div>
      </PageShell>
    );
  }

  // Calculate cumulative completions to determine locks
  const totalCompleted = tiers?.reduce((sum, t) => sum + t.completed, 0) || 0;

  return (
    <PageShell maxWidth="md">
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="text-center max-w-md mx-auto">
          <h2 className="font-serif text-3xl font-bold text-soil">Action Coach</h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Personalized micro-swaps designed to match your life. Complete actions to build carbon-reducing habits and grow your Living Forest.
          </p>
        </div>

        {/* Current Active Action Card */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold tracking-wider text-muted uppercase font-sans">
            Your Focus Swap
          </h3>
          <ActionCard />
        </div>

        {/* Action Tiers Progression */}
        <div className="flex flex-col gap-4 font-sans">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-wider text-muted uppercase">
              Action Tiers
            </h3>
            <span className="text-xs font-bold text-clay bg-clay/15 rounded-full px-3 py-1 flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              {totalCompleted} swaps completed
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {tiers?.map((tier) => {
              // Rule: Tier 1 is level 1, always unlocked.
              // Tier 2 requires 3 completions total (level 1 + etc)
              // Tier 3 requires 10 completions total.
              const isUnlocked = totalCompleted >= tier.unlockThreshold;
              const progressPct = isUnlocked 
                ? Math.min(100, Math.round((tier.completed / 5) * 100)) // visual progress indicator
                : 0;

              return (
                <motion.div
                  key={tier.level}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    className={`relative border-border-custom overflow-hidden transition-all duration-300 ${
                      isUnlocked 
                        ? "bg-surface" 
                        : "bg-surface/40 backdrop-blur-[2px] opacity-75"
                    }`}
                  >
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Title, icon, status */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl select-none" role="img" aria-label="tier icon">
                            {tier.icon}
                          </span>
                          <div className="flex flex-col">
                            <h4 className="font-serif text-lg font-bold text-soil flex items-center gap-1.5">
                              {tier.name}
                              {!isUnlocked && (
                                <Lock className="h-3.5 w-3.5 text-muted shrink-0 inline" />
                              )}
                            </h4>
                            <span className="text-[10px] text-muted font-semibold">
                              Tier {tier.level} Swap
                            </span>
                          </div>
                        </div>

                        {/* Completed count or Unlock requirements */}
                        {isUnlocked ? (
                          <span className="text-xs font-extrabold text-moss bg-moss/10 rounded-full px-2.5 py-1">
                            {tier.completed} completed
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted bg-border-custom/50 rounded-full px-2.5 py-1 flex items-center gap-1">
                            Locked · Requires {tier.unlockThreshold} completions
                          </span>
                        )}
                      </div>

                      {/* Tier Description */}
                      <p className="text-xs text-muted leading-relaxed max-w-md">
                        {tier.description}
                      </p>

                      {/* Progress Bar inside Unlocked Tiers */}
                      {isUnlocked && (
                        <div className="flex flex-col gap-1.5 pt-2">
                          <div className="flex justify-between text-[10px] font-extrabold text-muted uppercase">
                            <span>Tier progress</span>
                            <span>{tier.completed} completed</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-soil/5 dark:bg-soil/15 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                width: `${progressPct}%`,
                                backgroundColor: tier.color 
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Locked Overlay Details */}
                      {!isUnlocked && (
                        <div className="mt-1 pt-3 border-t border-border-custom/30 flex items-center gap-2 text-[10px] text-muted font-medium">
                          <ShieldAlert className="h-4 w-4 text-clay shrink-0" />
                          <span>
                            Complete {tier.unlockThreshold - totalCompleted} more action{tier.unlockThreshold - totalCompleted > 1 ? "s" : ""} to unlock these advanced carbon swaps.
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
