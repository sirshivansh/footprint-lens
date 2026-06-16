"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { LivingForest } from "@/components/impact/living-forest";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Button } from "@/components/ui";
import { Trees, Globe2, ShieldCheck, Heart, ArrowUpRight, Award, Compass } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-sans">
          <Card className="border border-border-custom bg-surface p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] text-muted font-bold tracking-wider uppercase">Tons Reduced</span>
            <span className="font-mono text-2xl font-black text-soil mt-1">{totalTons} t</span>
            <span className="text-[9px] text-muted font-semibold mt-0.5">CO₂e cumulative</span>
          </Card>
          <Card className="border border-border-custom bg-surface p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] text-muted font-bold tracking-wider uppercase">Acres Protected</span>
            <span className="font-mono text-2xl font-black text-soil mt-1">{stats?.acresProtected.toFixed(1)}</span>
            <span className="text-[9px] text-muted font-semibold mt-0.5">Ecosystem acreage</span>
          </Card>
          <Card className="border border-border-custom bg-surface p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] text-muted font-bold tracking-wider uppercase">Fund Allocated</span>
            <span className="font-mono text-2xl font-black text-soil mt-1">${stats?.fundsRaisedUsd.toLocaleString()}</span>
            <span className="text-[9px] text-muted font-semibold mt-0.5">Conservation funds</span>
          </Card>
          <Card className="border border-border-custom bg-surface p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] text-muted font-bold tracking-wider uppercase">Active Cohorts</span>
            <span className="font-mono text-2xl font-black text-soil mt-1">{stats?.activeUserCount}</span>
            <span className="text-[9px] text-muted font-semibold mt-0.5">Members worldwide</span>
          </Card>
        </div>

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
            {stats?.projects.map((proj) => (
              <Card
                key={proj.id}
                className="border border-border-custom bg-surface overflow-hidden shadow-md flex flex-col justify-between"
              >
                {/* Project Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${proj.satelliteImageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[9px] font-black text-sand bg-moss rounded-full px-2 py-0.5 uppercase tracking-wide">
                      {proj.partner} Verified
                    </span>
                    <h4 className="font-serif text-base font-bold text-white leading-tight mt-1">
                      {proj.projectName}
                    </h4>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-4 flex flex-col gap-3.5">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted font-bold uppercase">Carbon Offset</span>
                      <span className="font-mono font-extrabold text-soil">
                        {(proj.co2eOffsetKg / 1000).toFixed(1)} tons
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted font-bold uppercase">Area Protected</span>
                      <span className="font-mono font-extrabold text-soil">
                        {proj.areaProtectedAcres} Acres
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-custom/30 pt-3 text-[10px] text-muted">
                    <span className="font-mono">ID: {proj.certificateId}</span>
                    <a
                      href={proj.verificationUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-clay font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      Registry Link
                      <ArrowUpRight className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
