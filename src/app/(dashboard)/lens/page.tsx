"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { PillTabs } from "@/components/ui/pill-tabs";
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Button } from "@/components/ui";
import { trpc } from "@/lib/trpc/client";
import { Camera, Layers, Droplet, TreePine, Flame, Car, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export default function LensPage() {
  const [activeTab, setActiveTab] = useState("explorer");
  const [expandedEquiv, setExpandedEquiv] = useState<string | null>(null);
  
  // Time Machine Scrubber State (0 = Past, 1 = Present, 2 = Projected Future)
  const [scrubberVal, setScrubberVal] = useState(1);

  const { data: summary, isLoading: isSummaryLoading } = trpc.carbon.getSummary.useQuery({ period: "month" });
  const { data: tmData, isLoading: isTmLoading } = trpc.carbon.getTimeMachine.useQuery();

  const tabOptions = [
    { id: "explorer", label: "Equivalence Explorer" },
    { id: "time-machine", label: "Time Machine" },
    { id: "ar-view", label: "Simulated AR" },
  ];

  if (isSummaryLoading || isTmLoading) {
    return (
      <PageShell maxWidth="md">
        <Skeleton className="h-[450px] w-full rounded-custom-card" />
      </PageShell>
    );
  }

  // Equivalences mapping
  const equivItems = [
    {
      id: "balloons",
      emoji: "🎈",
      title: "Party Balloons",
      value: summary?.equivalences.balloons || 0,
      unit: "",
      desc: "Based on the volume of standard latex party balloons. Imagine these filling your house, floor to ceiling, stacking up month after month.",
    },
    {
      id: "arctic_ice",
      emoji: "🧊",
      title: "Arctic Sea Ice",
      value: summary?.equivalences.arcticIceSqft || 0,
      unit: "sq ft",
      desc: "Each ton of carbon emitted directly melts 32 square feet of Arctic sea ice. Think of this as chipping away at your bathroom floor of ice.",
    },
    {
      id: "trees",
      emoji: "🌳",
      title: "Trees Working",
      value: summary?.equivalences.treesWorkingYear || 0,
      unit: "",
      desc: "The number of mature trees that would need to photosynthesize full-time for an entire year to offset this volume of carbon.",
    },
    {
      id: "shower",
      emoji: "🚿",
      title: "Hot Showers",
      value: summary?.equivalences.showerHours || 0,
      unit: "hours",
      desc: "Equivalent energy consumption to leaving a standard hot shower running continuously. Hot water heating is an immense home energy drain.",
    },
    {
      id: "driving",
      emoji: "🚗",
      title: "Miles Driven",
      value: summary?.equivalences.milesDriven || 0,
      unit: "miles",
      desc: "Equivalent emissions to driving an average passenger gasoline car. This matches fuel combustion and typical tailpipe emissions.",
    },
    {
      id: "cheeseBlocks",
      emoji: "🧀",
      title: "Cheese Blocks",
      value: summary?.equivalences.cheeseBlocks || 0,
      unit: "blocks (1kg)",
      desc: "Equivalent carbon footprint of dairy cheese production. Dairy farming is a significant greenhouse gas contributor.",
    },
  ];

  // Scrubber details
  const getScrubberLabel = (val: number) => {
    if (val === 0) return { title: "Past Footprint", date: "Jan 2026", rate: tmData ? (tmData.history[0].annualRateKg / 1000).toFixed(1) : "14.2" };
    if (val === 1) return { title: "Current Footprint", date: "Today", rate: tmData ? (tmData.history[1].annualRateKg / 1000).toFixed(1) : "11.8" };
    return { title: "Projected Future", date: "Dec 2026", rate: tmData ? (tmData.projected[1].annualRateKg / 1000).toFixed(1) : "8.3" };
  };

  const scrubberDetails = getScrubberLabel(scrubberVal);

  return (
    <PageShell maxWidth="md">
      <div className="flex flex-col gap-6 items-center">
        {/* Navigation Tabs */}
        <PillTabs
          options={tabOptions}
          activeId={activeTab}
          onChange={setActiveTab}
          className="w-full justify-center"
        />

        {/* Tab Content */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === "explorer" && (
              <motion.div
                key="explorer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                <div className="text-center max-w-sm mx-auto mb-2">
                  <h3 className="font-serif text-2xl font-bold text-soil">
                    Equivalence Explorer
                  </h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Carbon is an invisible gas. We translate your monthly footprint into physical, tangible metaphors. Tap a card to inspect calculations.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {equivItems.map((item) => {
                    const isExpanded = expandedEquiv === item.id;
                    return (
                      <Card
                        key={item.id}
                        onClick={() => setExpandedEquiv(isExpanded ? null : item.id)}
                        className={cn(
                          "cursor-pointer border-border-custom bg-surface relative overflow-hidden transition-all duration-300 text-left flex flex-col justify-between hover:border-clay/40",
                          isExpanded ? "ring-1 ring-clay/30 sm:col-span-2" : ""
                        )}
                      >
                        <div className="flex items-start gap-4 p-5">
                          <span className="text-3xl select-none shrink-0">{item.emoji}</span>
                          <div className="flex flex-col text-left">
                            <span className="text-xs text-muted font-bold tracking-wide uppercase">
                              {item.title}
                            </span>
                            <span className="font-mono text-2xl font-extrabold text-soil">
                              {item.value.toLocaleString()} {item.unit}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Explanation */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-border-custom/50 bg-soil/5 dark:bg-soil/15 p-5 text-xs text-soil/95 leading-relaxed font-sans"
                            >
                              <p className="mb-2 font-semibold text-soil opacity-90">What does this represent?</p>
                              {item.desc}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "time-machine" && (
              <motion.div
                key="time-machine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-6"
              >
                <Card className="border-border-custom bg-surface p-6 shadow-md text-center flex flex-col items-center gap-6">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-serif text-2xl font-bold text-soil">
                      Timeline Scrubber
                    </h3>
                    <p className="text-xs text-muted max-w-sm">
                      Slide to traverse your carbon rate history and see projected outcomes based on completed swaps.
                    </p>
                  </div>

                  {/* Scrubber Value Indicator Card */}
                  <div className="rounded-custom-btn bg-background/50 border border-border-custom px-6 py-4 flex flex-col items-center gap-1.5 min-w-[200px]">
                    <span className="text-xs font-bold text-muted tracking-wider uppercase font-sans">
                      {scrubberDetails.title} ({scrubberDetails.date})
                    </span>
                    <span className="font-mono text-4xl font-black text-soil">
                      {scrubberDetails.rate} <span className="text-sm font-bold text-muted">tons/yr</span>
                    </span>
                  </div>

                  {/* HTML Input Slider (Range) Scrubber */}
                  <div className="w-full max-w-md flex flex-col gap-2 font-sans py-4">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="1"
                      value={scrubberVal}
                      onChange={(e) => setScrubberVal(parseInt(e.target.value))}
                      className="w-full h-2 rounded-full bg-soil/10 dark:bg-soil/25 appearance-none cursor-pointer accent-clay"
                    />
                    <div className="flex justify-between text-[10px] font-extrabold text-muted uppercase tracking-widest px-1">
                      <span>Past</span>
                      <span>Present</span>
                      <span>Projected</span>
                    </div>
                  </div>

                  {/* Dynamic description of current scenario */}
                  <div className="text-sm text-muted max-w-sm leading-relaxed text-center px-4 font-sans italic">
                    {scrubberVal === 0 && (
                      "In January 2026, your starting footprint was higher. Your transport and diet habits generated significant carbon overhead before you initiated swaps."
                    )}
                    {scrubberVal === 1 && (
                      `Today, your footprint rate is down to ${scrubberDetails.rate} tons/yr. Swapping dairy milk for oat milk and adjusting your heating thermostat has helped reduce emissions.`
                    )}
                    {scrubberVal === 2 && (
                      `If you maintain your action momentum and complete unlocked Habit Builder swaps, your footprint is projected to decline to ${scrubberDetails.rate} tons/yr by December!`
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "ar-view" && (
              <motion.div
                key="ar-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-4 text-center"
              >
                <div className="max-w-sm mx-auto mb-2">
                  <h3 className="font-serif text-2xl font-bold text-soil">
                    Simulated AR Viewer
                  </h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Translate carbon into volumetric balloons inside your living space. To view in real AR, scan this with your phone.
                  </p>
                </div>

                <div className="relative overflow-hidden w-full aspect-[16/9] rounded-2xl border border-border-custom bg-soil/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80')]" />
                  
                  {/* Floating AR balloons simulation */}
                  <div className="absolute inset-0">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                      className="absolute top-1/4 left-1/3 h-14 w-14 rounded-full bg-clay/20 border border-clay/40 backdrop-blur-sm flex items-center justify-center text-[10px] font-mono text-clay font-bold shadow-inner"
                    >
                      CO₂
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.3 }}
                      className="absolute top-1/3 right-1/3 h-16 w-16 rounded-full bg-moss/20 border border-moss/40 backdrop-blur-sm flex items-center justify-center text-[10px] font-mono text-moss font-bold shadow-inner"
                    >
                      Swapped
                    </motion.div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border border-border-custom p-3 rounded-custom-btn flex items-center gap-2.5 text-left">
                    <Camera className="h-5 w-5 text-clay shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-soil">Lens: Room View</span>
                      <span className="text-[10px] text-muted">Showing monthly carbon volume.</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" className="text-xs font-bold h-9">
                    RECALIBRATE
                  </Button>
                  <Button className="text-xs font-bold h-9 bg-clay border-clay">
                    START WEB-AR
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
}
