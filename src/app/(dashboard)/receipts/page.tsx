"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ReceiptLens } from "@/components/lens/receipt-lens";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Button } from "@/components/ui";
import { Calendar, FileText, ChevronDown, ChevronUp, Sparkles, TrendingDown, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export default function ReceiptsPage() {
  const { data: history, isLoading } = trpc.receipts.getHistory.useQuery();
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedReceiptId(expandedReceiptId === id ? null : id);
  };

  return (
    <PageShell maxWidth="md">
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="text-center max-w-md mx-auto">
          <h2 className="font-serif text-3xl font-bold text-soil">Receipt Lens</h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Scan your grocery store paper receipts client-side using WASM OCR. Get instant carbon analysis on individual food items and discover sustainable alternatives.
          </p>
        </div>

        {/* OCR Scanner Component */}
        <ReceiptLens />

        {/* History Section */}
        <div className="flex flex-col gap-4 font-sans">
          <h3 className="text-xs font-bold tracking-wider text-muted uppercase">
            Receipt Scan History
          </h3>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-20 w-full rounded-custom-btn" />
              <Skeleton className="h-20 w-full rounded-custom-btn" />
            </div>
          ) : !history || history.length === 0 ? (
            <Card className="p-8 border-border-custom bg-surface text-center">
              <FileText className="h-10 w-10 text-muted/40 mx-auto mb-2.5" />
              <p className="text-xs text-muted">No receipts scanned yet. Upload an image above to start scanning.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((receipt) => {
                const isExpanded = expandedReceiptId === receipt.id;
                const dateStr = new Date(receipt.scannedAt ?? new Date()).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <motion.div
                    key={receipt.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <Card className="border border-border-custom bg-surface transition-all duration-200">
                      {/* Accordion Trigger Header */}
                      <div
                        onClick={() => toggleExpand(receipt.id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-background/25 select-none transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-[70%]">
                          {/* Mini Thumbnail */}
                          {receipt.imageUrl && receipt.imageUrl.startsWith("data:") ? (
                            <div
                              className="h-11 w-11 rounded-custom-input border border-border-custom bg-cover bg-center shrink-0"
                              style={{ backgroundImage: `url(${receipt.imageUrl})` }}
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-custom-input border border-border-custom bg-background/50 text-muted flex items-center justify-center shrink-0">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}

                          <div className="flex flex-col text-left">
                            <span className="font-bold text-sm text-soil flex items-center gap-1.5">
                              Grocery Invoice
                              {receipt.potentialReductionPercent > 0 && (
                                <span className="text-[10px] font-bold text-moss bg-moss/10 rounded-full px-2 py-0.5">
                                  ↓{receipt.potentialReductionPercent}% Potential
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              {dateStr}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-black text-soil">
                              {receipt.totalCo2eKg.toFixed(1)} <span className="text-[10px] font-bold text-muted">kg</span>
                            </span>
                            <span className="text-[10px] text-muted font-bold">
                              {receipt.items.length} item{receipt.items.length > 1 ? "s" : ""}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Expandable Accordion Body */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-border-custom/50 bg-soil/5 dark:bg-soil/15 font-sans"
                          >
                            <div className="p-4 flex flex-col gap-4">
                              {/* Summary Box */}
                              {receipt.potentialReductionPercent > 0 && (
                                <div className="rounded-custom-btn border border-moss/20 bg-moss/5 p-3 flex items-center gap-3">
                                  <TrendingDown className="h-5 w-5 text-moss shrink-0" />
                                  <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-soil">Swap & Save Opportunity</span>
                                    <span className="text-[10px] text-muted leading-tight">
                                      Swapping highlighted items could lower this invoice's footprint from{" "}
                                      <strong className="text-soil">{receipt.totalCo2eKg} kg</strong> to{" "}
                                      <strong className="text-moss">{receipt.potentialCo2eKg} kg</strong>.
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Itemized list */}
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold tracking-widest text-muted uppercase">
                                  Receipt Items
                                </span>
                                <div className="flex flex-col gap-2">
                                  {receipt.items.map((item, idx) => {
                                    const isRed = item.impactLevel === "high";
                                    const isAmber = item.impactLevel === "moderate";

                                    return (
                                      <div
                                        key={idx}
                                        className="p-3 bg-surface rounded-custom-btn border border-border-custom/40 flex flex-col gap-1.5 text-left"
                                      >
                                        <div className="flex justify-between items-center text-xs">
                                          <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                                            <span className="font-bold text-soil truncate">
                                              {item.itemName}
                                            </span>
                                            {item.price && (
                                              <span className="text-[10px] text-muted">
                                                · ${item.price.toFixed(2)}
                                              </span>
                                            )}
                                          </div>
                                          <span
                                            className={cn(
                                              "font-mono font-extrabold text-[10px] rounded-full px-2 py-0.5 uppercase",
                                              isRed
                                                ? "bg-ember/15 text-ember"
                                                : isAmber
                                                ? "bg-clay/15 text-clay"
                                                : "bg-moss/15 text-moss"
                                            )}
                                          >
                                            {item.co2eKg.toFixed(1)} kg CO₂
                                          </span>
                                        </div>

                                        {/* Suggested Swap in History */}
                                        {item.suggestedSwap && (
                                          <div className="border-t border-dashed border-border-custom/40 mt-1 pt-1.5 flex flex-col gap-0.5 text-[10px]">
                                            <span className="text-muted">
                                              💡 Suggested Swap: <strong className="text-soil font-bold">{item.suggestedSwap}</strong>
                                            </span>
                                            <span className="text-moss font-bold">
                                              Saves {(item.co2eKg - (item.swapCo2eKg || 0)).toFixed(1)} kg CO₂e
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
