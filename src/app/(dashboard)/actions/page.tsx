"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ActionCard } from "@/components/actions/action-card";
import { trpc } from "@/lib/trpc/client";
import { TierCard } from "@/components/actions/tier-card";
import { Skeleton } from "@/components/ui";
import { Award } from "lucide-react";

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

              return (
                <TierCard
                  key={tier.level}
                  name={tier.name}
                  level={tier.level}
                  icon={tier.icon}
                  color={tier.color}
                  status={isUnlocked ? "unlocked" : "locked"}
                  completed={tier.completed}
                  total={tier.level === 1 ? 5 : tier.level === 2 ? 8 : 10}
                  unlockMessage={`Complete ${tier.unlockThreshold} actions to unlock ${tier.name}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
