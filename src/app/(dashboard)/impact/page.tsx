"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { LivingForest } from "@/components/impact/living-forest";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Button } from "@/components/ui";
import { Trees, Globe2, ShieldCheck, Heart, ArrowUpRight, Award, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { CollectiveStats } from "@/components/impact/collective-stats";
import { VerificationCard } from "@/components/impact/verification-card";

export default function ImpactPage() {
  const { data: stats, isLoading } = trpc.carbon.getCollectiveImpact.useQuery();

  if (isLoading) {
    return (
      <PageShell maxWidth="md">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 w-full rounded-custom-card animate-pulse" />
          <Skeleton className="h-[400px] w-full rounded-custom-card animate-pulse" />
        </div>
      </PageShell>
    );
  }

  const totalTons = stats ? (stats.totalCo2eReducedKg / 1000).toFixed(1) : "0.0";
  const userTons = stats ? (stats.userReducedKg / 1000).toFixed(3) : "0.000";

  return (
    <PageShell maxWidth="md">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="text-center max-w-md mx-auto mb-2">
          <h2 className="font-serif text-3xl font-bold text-soil">Climate Impact</h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Verify the physical impact of your lifestyle swaps. See how your individual effort aggregates into our collective forestation and ecosystem protection initiatives.
          </p>
        </div>

        {/* Collective Impact Dashboard Row */}
        <CollectiveStats
          stats={[
            { label: "CO₂e cumulative", value: parseFloat(totalTons), unit: "Tons Reduced", icon: "🌍" },
            { label: "Ecosystem acreage", value: stats?.acresProtected || 0, unit: "Acres Protected", icon: "🌱" },
            { label: "Conservation funds", value: stats?.fundsRaisedUsd || 0, unit: "Fund Allocated", icon: "💰" },
            { label: "Members worldwide", value: stats?.activeUserCount || 0, unit: "Active Cohorts", icon: "👥" },
          ]}
        />

        {/* Interactive Living Forest Component */}
        <LivingForest />

        {/* "Your Slice" Contribution Card */}
        <Card className="border border-border-custom bg-surface shadow-sm font-sans text-left">
          <div className="p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-widest text-muted uppercase">
              Your Slice of the Forest
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted font-bold tracking-wider uppercase">
                  Personal Savings
                </span>
                <span className="font-mono text-3xl font-black text-soil leading-tight">
                  {stats?.userReducedKg.toFixed(1)} <span className="text-sm font-bold text-muted">kg CO₂e</span>
                </span>
                <span className="text-xs text-muted mt-1 leading-relaxed max-w-sm">
                  Your swaps represent <strong className="text-moss font-bold">{stats?.userSharePercent.toFixed(4)}%</strong> of the total carbon saved by all Footprint Lens members.
                </span>
              </div>

              {/* Progress visual indicator */}
              <div className="relative h-20 w-20 shrink-0 flex items-center justify-center bg-moss/5 rounded-full border border-moss/10 shadow-inner select-none">
                <Compass className="h-8 w-8 text-moss/30 absolute" />
                <span className="text-xs font-mono font-black text-moss z-10">
                  {stats?.userSharePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Verified Conservation Projects Section */}
        <div className="flex flex-col gap-4 font-sans text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-moss" />
            <h3 className="text-xs font-bold tracking-wider text-soil uppercase font-sans">
              Verified Conservation Projects
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats?.projects.map((proj, idx) => (
              <VerificationCard
                key={proj.id}
                index={idx}
                project={{
                  partner: proj.partner,
                  projectName: proj.projectName,
                  certificateId: proj.certificateId || undefined,
                  verificationUrl: proj.verificationUrl || undefined,
                  co2eOffsetKg: proj.co2eOffsetKg || undefined,
                  areaProtectedAcres: proj.areaProtectedAcres || undefined,
                  satelliteImageUrl: proj.satelliteImageUrl || undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
