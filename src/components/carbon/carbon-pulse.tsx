"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui";
import { DeltaBadge } from "./delta-badge";

export function CarbonPulse() {
  const { data, isLoading, error } = trpc.carbon.getSummary.useQuery({ period: "month" });

  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-custom-card" />;
  }

  if (error || !data) {
    return (
      <Card className="border-ember/30 bg-ember/5 text-center p-6">
        <p className="text-sm text-ember font-semibold">Failed to load carbon summary</p>
      </Card>
    );
  }

  // Format co2e: display in tons if >= 1000 kg, otherwise display in kg
  const displayInTons = data.totalCo2eKg >= 1000;
  const displayTotal = displayInTons
    ? (data.totalCo2eKg / 1000).toFixed(2)
    : Math.round(data.totalCo2eKg).toLocaleString();
  const displayUnit = displayInTons ? "tons CO₂e" : "kg CO₂e";

  const prevDisplayInTons = data.previousPeriodCo2eKg >= 1000;
  const prevDisplayTotal = prevDisplayInTons
    ? (data.previousPeriodCo2eKg / 1000).toFixed(2)
    : Math.round(data.previousPeriodCo2eKg).toLocaleString();
  const prevDisplayUnit = prevDisplayInTons ? "tons" : "kg";

  // Comparison bar percentages
  const maxVal = Math.max(data.totalCo2eKg, data.previousPeriodCo2eKg, 1);
  const currentPercent = (data.totalCo2eKg / maxVal) * 100;
  const prevPercent = (data.previousPeriodCo2eKg / maxVal) * 100;

  return (
    <Card className="flex flex-col justify-between border-border-custom bg-surface relative overflow-hidden shadow-md">
      {/* Decorative background pulse */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-clay/5 blur-xl animate-pulse" />

      <CardHeader className="pb-2">
        <span className="text-xs font-bold tracking-widest text-muted uppercase font-sans">
          Your Carbon Footprint
        </span>
        <CardTitle className="text-soil opacity-90 text-sm">
          OCTOBER PULSE
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-2">
        {/* Footprint Number & Unit */}
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-5xl font-black text-soil leading-none">
              {displayTotal}
            </h2>
            <span className="font-sans text-lg font-bold text-muted">
              {displayUnit}
            </span>
          </div>
          {/* Delta status */}
          <DeltaBadge percent={data.deltaPercent} className="mt-2" />
        </div>

        {/* Visual comparison bar widget */}
        <div className="flex flex-col gap-3 border-t border-border-custom/50 pt-4 font-sans">
          {/* This period */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-soil">This Period</span>
              <span className="font-mono text-soil">{displayTotal} {displayUnit}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-soil/5 dark:bg-soil/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-clay transition-all duration-500 ease-out"
                style={{ width: `${currentPercent}%` }}
              />
            </div>
          </div>

          {/* Previous period */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold text-muted">
              <span>Last Period</span>
              <span className="font-mono">{prevDisplayTotal} {prevDisplayUnit}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-soil/5 dark:bg-soil/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-muted/40 transition-all duration-500 ease-out"
                style={{ width: `${prevPercent}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
