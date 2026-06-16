"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { CarbonPulse } from "@/components/carbon/carbon-pulse";
import { CategoryBreakdown } from "@/components/carbon/category-breakdown";
import { GlacierWidget } from "@/components/lens/glacier-widget";
import { ManualEntryForm } from "@/components/carbon/manual-entry-form";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui";
import { Car, Leaf, Flame, ShoppingBag, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  const utils = trpc.useUtils();
  const { data: txData, isLoading: isTxLoading } = trpc.carbon.getTransactions.useQuery({
    page: 1,
    perPage: 5,
  });

  // Category Icons map
  const categoryIcons: Record<string, any> = {
    transport: Car,
    diet: Leaf,
    energy: Flame,
    shopping: ShoppingBag,
    other: HelpCircle,
  };

  const categoryTexts: Record<string, string> = {
    transport: "text-sky",
    diet: "text-moss",
    energy: "text-clay",
    shopping: "text-soil dark:text-soil",
    other: "text-muted",
  };

  // Refetch summary and transactions list after a manual transaction log
  const handleTxLogged = () => {
    utils.carbon.getSummary.invalidate();
    utils.carbon.getTransactions.invalidate();
  };

  return (
    <PageShell maxWidth="xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-start">
        
        {/* Left Column - Footprint & Breakdowns (7 cols on desktop) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <CarbonPulse />
          <CategoryBreakdown />
        </div>

        {/* Right Column - Glacier, Form, & Transactions (5 cols on desktop) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <GlacierWidget />
          <ManualEntryForm onSuccess={handleTxLogged} />

          {/* Recent Transactions Card */}
          <Card className="border-border-custom bg-surface shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-soil opacity-90 text-sm tracking-wide uppercase font-sans">
                Recent Ledger
              </CardTitle>
              <Link
                href="/receipts"
                className="text-xs font-bold text-muted hover:text-clay transition-colors flex items-center gap-1 uppercase"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-2 font-sans flex flex-col gap-3">
              {isTxLoading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-12 w-full rounded-custom-btn" />
                  <Skeleton className="h-12 w-full rounded-custom-btn" />
                  <Skeleton className="h-12 w-full rounded-custom-btn" />
                </div>
              ) : txData && txData.data.length > 0 ? (
                txData.data.map((tx) => {
                  const Icon = categoryIcons[tx.category] || HelpCircle;
                  const iconColor = categoryTexts[tx.category] || "text-muted";
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between border-b border-border-custom/30 pb-2.5 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-soil/5 dark:bg-soil/10 shrink-0", iconColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold text-sm text-soil truncate">
                            {tx.merchantName}
                          </span>
                          <span className="text-[10px] text-muted font-semibold">
                            {new Date(tx.transactionDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-extrabold text-soil block">
                          +{tx.co2eKg.toFixed(1)} kg
                        </span>
                        <span className="text-[10px] text-muted font-bold block">
                          ${tx.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-sm text-muted">
                  No transactions logged yet.
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </PageShell>
  );
}
