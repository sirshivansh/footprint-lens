"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui";
import { Car, Leaf, Flame, ShoppingBag, HelpCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function CategoryBreakdown() {
  const { data, isLoading } = trpc.carbon.getSummary.useQuery({ period: "month" });

  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-custom-card" />;
  }

  if (!data) return null;

  // Icons map
  const categoryIcons: Record<string, any> = {
    transport: Car,
    diet: Leaf,
    energy: Flame,
    shopping: ShoppingBag,
    other: HelpCircle,
  };

  // Color mappings based on design system
  const categoryColors: Record<string, string> = {
    transport: "bg-sky text-sky-foreground",
    diet: "bg-moss text-moss-foreground",
    energy: "bg-clay text-clay-foreground",
    shopping: "bg-soil text-sand",
    other: "bg-muted text-muted-foreground",
  };

  const categoryTexts: Record<string, string> = {
    transport: "text-sky",
    diet: "text-moss",
    energy: "text-clay",
    shopping: "text-soil dark:text-soil",
    other: "text-muted",
  };

  return (
    <Card className="border-border-custom bg-surface shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-soil opacity-90 text-sm tracking-wide uppercase font-sans">
          Emissions Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-2 font-sans">
        {data.breakdown.map((item) => {
          const cat = item.category.toLowerCase();
          const Icon = categoryIcons[cat] || HelpCircle;
          const barColor = categoryColors[cat] || "bg-muted";
          const iconColor = categoryTexts[cat] || "text-muted";

          return (
            <div key={item.category} className="flex flex-col gap-1">
              {/* Info row */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-soil/5 dark:bg-soil/10", iconColor)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-soil capitalize">
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-soil">
                    {Math.round(item.co2eKg).toLocaleString()} kg
                  </span>
                  <span className="text-xs text-muted ml-1.5 font-semibold">
                    ({item.percent}%)
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full rounded-full bg-soil/5 dark:bg-soil/15 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500 ease-out", barColor)}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
