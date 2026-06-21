"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, Skeleton } from "@/components/ui";
import { Trees, Info, ShieldAlert, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Tree {
  id: string;
  treeSpecies: string;
  reductionCategory: string;
  co2eRepresentedKg: number;
  positionX: number;
  positionY: number;
  isMilestone: boolean;
  wildlifeUnlocked: string | null;
  plantedAt: Date;
}

export function LivingForest() {
  const { data: trees, isLoading } = trpc.carbon.getForest.useQuery();
  const { data: profileData } = trpc.profile.getProfile.useQuery();
  const [hoveredTree, setHoveredTree] = useState<Tree | null>(null);

  // Tick timer to reactively update growth stages for new trees in real-time
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const pollenParticles = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const left = Math.random() * 100;
      const top = 30 + Math.random() * 50;
      const size = 2 + (i % 3) * 1.2; 
      const duration = 6 + (i % 4) * 2; 
      const delay = -(i * 0.7);
      const opacity = 0.2 + (i % 3) * 0.15; 
      return { id: i, left, top, size, duration, delay, opacity };
    });
  }, []);

  const leafParticles = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const left = Math.random() * 95;
      const size = 5 + (i % 3) * 2.5; 
      const duration = 7 + (i % 3) * 3; 
      const delay = -(i * 1.5);
      const opacity = 0.25 + (i % 2) * 0.25; 
      const colors = ["#7CB87B", "#C67B5C", "#E07151", "#FFB7B2"];
      const color = colors[i % colors.length];
      return { id: i, left, size, duration, delay, opacity, color };
    });
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-custom-card animate-pulse" />;
  }

  const plantedCount = trees?.length || 0;
  const totalSaved = profileData?.profile?.totalCo2ReducedKg 
    ? parseFloat(profileData.profile.totalCo2ReducedKg.toString()) 
    : 0;
  const progressToNextTree = Math.round(totalSaved % 100);

  // Growth Stage Logic:
  // Stage 0: Seedling, Stage 1: Sprout, Stage 2: Sapling, Stage 3: Fully Grown, Stage 4: Flowering
  const getGrowthStage = (plantedAt: Date | string | null, isMilestone: boolean, id: string) => {
    if (!plantedAt) return 3; // default to fully grown if no date
    const plantedTime = new Date(plantedAt).getTime();
    const now = new Date().getTime();
    const elapsedSec = (now - plantedTime) / 1000;

    // Real-time growth within 3 minutes of planting
    if (elapsedSec < 30) {
      return 0; // Seedling
    } else if (elapsedSec < 60) {
      return 1; // Sprout
    } else if (elapsedSec < 120) {
      return 2; // Sapling
    } else if (elapsedSec < 180) {
      return 3; // Fully Grown
    }

    if (isMilestone) {
      return 4; // Milestone trees are always flowering
    }

    // Older trees get deterministic stages to add visual variety
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
    const mod = hash % 10;
    if (mod < 6) return 3; // 60% Fully Grown
    if (mod < 8) return 4; // 20% Flowering/Mature
    return 2; // 20% Sapling
  };

  // Render tree SVG based on species & growth stage
  const renderTreeSVG = (species: string, isMilestone: boolean, stage: number) => {
    const scale = isMilestone ? 1.25 : 1.0;
    
    // Stage 0: Seedling (Shared design)
    if (stage === 0) {
      return (
        <g transform={`scale(${scale})`}>
          <rect x="-1" y="2" width="2" height="1.5" fill="#654321" stroke="#2C2640" strokeWidth="0.8" />
          <rect x="0.5" y="-1.5" width="1.2" height="2" fill="#7CB87B" stroke="#2C2640" strokeWidth="0.8" />
        </g>
      );
    }
    
    // Stage 1: Sprout (Shared design)
    if (stage === 1) {
      return (
        <g transform={`scale(${scale})`}>
          <rect x="-0.5" y="0" width="1" height="4" fill="#7CB87B" stroke="#2C2640" strokeWidth="0.8" />
          <rect x="-2.5" y="-2" width="2" height="1.5" fill="#699D4B" stroke="#2C2640" strokeWidth="0.8" />
          <rect x="0.5" y="-3.5" width="2" height="1.5" fill="#84C362" stroke="#2C2640" strokeWidth="0.8" />
        </g>
      );
    }

    // Stage 2: Sapling (Shared design)
    if (stage === 2) {
      return (
        <g transform={`scale(${scale})`}>
          <rect x="-0.8" y="0" width="1.6" height="8" fill="#5C4033" stroke="#2C2640" strokeWidth="0.8" />
          <rect x="-4.8" y="-4.5" width="9.6" height="5" fill="#5B8C5A" stroke="#2C2640" strokeWidth="0.8" />
        </g>
      );
    }

    // Stage 3 (Fully Grown) & Stage 4 (Flowering / Mature)
    switch (species.toLowerCase()) {
      case "birch": // transport
        return (
          <g transform={`scale(${scale})`}>
            {/* Trunk */}
            <rect x="-1.5" y="0" width="3" height="18" fill="#FAF6F0" stroke="#2C2640" strokeWidth="1" />
            <line x1="-1.5" y1="5" x2="0" y2="5" stroke="#2C2640" strokeWidth="1" />
            <line x1="0" y1="10" x2="1.5" y2="10" stroke="#2C2640" strokeWidth="1" />
            {/* Stepped Voxel Canopy */}
            <rect x="-7" y="-10" width="14" height="8" fill="#78B159" stroke="#2C2640" strokeWidth="1" />
            <rect x="-4" y="-16" width="8" height="6" fill="#84C362" stroke="#2C2640" strokeWidth="1" />
            {/* Stage 4: Birch yellow tassels (blocks) */}
            {stage === 4 && (
              <>
                <rect x="-6" y="-7" width="2" height="2" fill="#FAD02C" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="4" y="-5" width="2" height="2" fill="#FAD02C" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="-2" y="-14" width="2" height="2" fill="#FAD02C" stroke="#2C2640" strokeWidth="0.5" />
              </>
            )}
          </g>
        );
      case "pine": // energy
        return (
          <g transform={`scale(${scale})`}>
            <rect x="-2" y="0" width="4" height="12" fill="#5C4033" stroke="#2C2640" strokeWidth="1" />
            <rect x="-10" y="-4" width="20" height="4" fill="#1E4620" stroke="#2C2640" strokeWidth="1" />
            <rect x="-8" y="-8" width="16" height="4" fill="#2E5A30" stroke="#2C2640" strokeWidth="1" />
            <rect x="-6" y="-12" width="12" height="4" fill="#3D7040" stroke="#2C2640" strokeWidth="1" />
            <rect x="-3" y="-16" width="6" height="4" fill="#4C8A50" stroke="#2C2640" strokeWidth="1" />
            {/* Stage 4: Pinecones */}
            {stage === 4 && (
              <>
                <rect x="-7" y="-2" width="2" height="2.5" fill="#4E3629" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="5" y="-2" width="2" height="2.5" fill="#4E3629" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="-4" y="-10" width="2" height="2.5" fill="#4E3629" stroke="#2C2640" strokeWidth="0.5" />
              </>
            )}
          </g>
        );
      case "spruce": // shopping
        return (
          <g transform={`scale(${scale})`}>
            <rect x="-1.5" y="0" width="3" height="11" fill="#4A3B32" stroke="#2C2640" strokeWidth="1" />
            <rect x="-9" y="-3" width="18" height="3" fill="#2D4D43" stroke="#2C2640" strokeWidth="1" />
            <rect x="-7" y="-7" width="14" height="4" fill="#385F53" stroke="#2C2640" strokeWidth="1" />
            <rect x="-5" y="-11" width="10" height="4" fill="#447365" stroke="#2C2640" strokeWidth="1" />
            <rect x="-2" y="-14" width="4" height="3" fill="#508777" stroke="#2C2640" strokeWidth="1" />
            {/* Stage 4: Snow-dusted tops */}
            {stage === 4 && (
              <>
                <rect x="-4" y="-14" width="8" height="1.5" fill="#FAF6F0" />
                <rect x="-2" y="-15.5" width="4" height="1.5" fill="#FAF6F0" />
              </>
            )}
          </g>
        );
      case "cedar": // other
        return (
          <g transform={`scale(${scale})`}>
            <rect x="-2.5" y="0" width="5" height="10" fill="#6E473B" stroke="#2C2640" strokeWidth="1" />
            <rect x="-11" y="-4" width="22" height="3" fill="#34594B" stroke="#2C2640" strokeWidth="1" />
            <rect x="-8" y="-8" width="16" height="3.5" fill="#3F6B5A" stroke="#2C2640" strokeWidth="1" />
            <rect x="-5" y="-12" width="10" height="3.5" fill="#4B806C" stroke="#2C2640" strokeWidth="1" />
            {/* Stage 4: Blue Juniper Berries */}
            {stage === 4 && (
              <>
                <rect x="-9" y="-2" width="1.5" height="1.5" fill="#2B4C7E" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="7" y="-2" width="1.5" height="1.5" fill="#2B4C7E" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="-4" y="-6.5" width="1.5" height="1.5" fill="#2B4C7E" stroke="#2C2640" strokeWidth="0.5" />
              </>
            )}
          </g>
        );
      case "oak": // diet (default)
      default:
        return (
          <g transform={`scale(${scale})`}>
            <rect x="-3" y="0" width="6" height="16" fill="#654321" stroke="#2C2640" strokeWidth="1" />
            <rect x="-9" y="-12" width="18" height="9" fill="#2A472E" stroke="#2C2640" strokeWidth="1" />
            <rect x="-6" y="-18" width="12" height="6" fill="#365C3B" stroke="#2C2640" strokeWidth="1" />
            <rect x="-3" y="-22" width="6" height="4" fill="#3E6843" stroke="#2C2640" strokeWidth="1" />
            {/* Stage 4: Red/Clay Acorns */}
            {stage === 4 && (
              <>
                <rect x="-5" y="-8" width="2" height="2" fill="#C67B5C" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="3" y="-9" width="2" height="2" fill="#C67B5C" stroke="#2C2640" strokeWidth="0.5" />
                <rect x="-1" y="-15" width="2" height="2" fill="#C67B5C" stroke="#2C2640" strokeWidth="0.5" />
              </>
            )}
          </g>
        );
    }
  };

  // Render fox SVG
  const renderFox = (x: number, y: number) => {
    return (
      <g transform={`translate(${x}, ${y}) scale(0.6)`} className="cursor-pointer select-none">
        {/* Tail */}
        <path d="M-10,4 Q-14,0 -16,-6 Q-12,-8 -8,-4 Z" fill="#C67B5C" />
        <path d="M-16,-6 Q-14,-9 -12,-8 Z" fill="#F5EBE6" />
        {/* Body */}
        <ellipse cx="-2" cy="1" rx="7" ry="5" fill="#C67B5C" />
        {/* Legs */}
        <line x1="-5" y1="4" x2="-5" y2="9" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="1" y1="4" x2="1" y2="9" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="-8" y1="3" x2="-8" y2="8" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4" y1="3" x2="4" y2="8" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
        {/* Neck/Chest */}
        <circle cx="4" cy="-2" r="4.5" fill="#F5EBE6" />
        {/* Head */}
        <polygon points="2,-7 12,-7 7,-2" fill="#C67B5C" />
        {/* Ears */}
        <polygon points="3,-7 2,-11 6,-8" fill="#8C4F35" />
        <polygon points="11,-7 12,-11 8,-8" fill="#8C4F35" />
        {/* Snout */}
        <polygon points="7,-2 8,-1 6,-1" fill="#333" />
        {/* Eyes */}
        <circle cx="5" cy="-5" r="0.8" fill="#000" />
        <circle cx="9" cy="-5" r="0.8" fill="#000" />
      </g>
    );
  };

  return (
    <Card className="gradient-glass-card overflow-hidden">
      <div className="p-5 flex flex-col gap-5">
        {/* Forest Stats Header */}
        <div className="flex items-center justify-between border-b border-border-custom/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-moss/10 text-moss flex items-center justify-center">
              <Trees className="h-5.5 w-5.5" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-serif text-lg font-bold text-soil flex items-center gap-1.5">
                Living Forest
              </h3>
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                Procedural Impact visualization
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col">
            <span className="font-mono text-xl font-black text-soil">
              {plantedCount} <span className="text-xs font-bold text-muted">tree{plantedCount !== 1 ? "s" : ""}</span>
            </span>
            <span className="text-[10px] text-muted font-semibold">
              1 tree / 100 kg reduced
            </span>
          </div>
        </div>

        {/* The SVG Forest Area */}
        <div className="relative border border-border-custom/80 bg-background/35 rounded-custom-card overflow-hidden w-full aspect-[4/3] flex items-center justify-center">
          {plantedCount === 0 ? (
            /* Empty State Meadow */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-sky/5 via-sand/5 to-moss/10">
              <Trees className="h-12 w-12 text-muted/40 mb-3.5 animate-bounce" />
              <h4 className="font-serif text-lg font-bold text-soil">Your forest is waiting</h4>
              <p className="text-xs text-muted max-w-xs mt-1.5 leading-relaxed">
                Complete carbon-reducing swaps in your Action Coach. For every 100 kg CO₂e you reduce, a new tree grows in this meadow!
              </p>
            </div>
          ) : (
            /* Active Forest Render */
            <>
              {/* Sky and Ground background colors */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#E2ECE9] dark:from-[#1D2B2B] via-[#F2EDE4] dark:via-[#222320] to-[#E3D9C9] dark:to-[#1C1A17] opacity-60" />

              <svg
                viewBox="0 0 100 75"
                className="w-full h-full relative z-10 select-none overflow-visible"
              >
                {/* Meadow grass decorative tufts */}
                <path d="M10,65 L12,63 L14,65" stroke="#A3B899" strokeWidth="0.5" fill="none" opacity="0.7" />
                <path d="M45,55 L47,53 L49,55" stroke="#A3B899" strokeWidth="0.5" fill="none" opacity="0.7" />
                <path d="M78,62 L80,60 L82,62" stroke="#A3B899" strokeWidth="0.5" fill="none" opacity="0.7" />
                <path d="M25,48 L27,46 L29,48" stroke="#A3B899" strokeWidth="0.5" fill="none" opacity="0.7" />
                <path d="M60,68 L62,66 L64,68" stroke="#A3B899" strokeWidth="0.5" fill="none" opacity="0.7" />

                {/* Render Trees. Sorted by Y coordinates */}
                {[...(trees || [])]
                  .sort((a, b) => a.positionY - b.positionY)
                  .map((tree) => {
                    const x = tree.positionX;
                    const y = 25 + (tree.positionY * 0.43); 
                    const stage = getGrowthStage(tree.plantedAt, tree.isMilestone, tree.id);

                    return (
                      <g
                        key={tree.id}
                        transform={`translate(${x}, ${y})`}
                        onMouseEnter={() => setHoveredTree(tree as unknown as Tree)}
                        onMouseLeave={() => setHoveredTree(null)}
                        className="cursor-pointer transition-all duration-200 hover:filter hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                      >
                        <AnimatePresence mode="wait">
                          <motion.g
                            key={`${tree.id}-${stage}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                          >
                            {renderTreeSVG(tree.treeSpecies, tree.isMilestone, stage)}
                          </motion.g>
                        </AnimatePresence>
                      </g>
                    );
                  })}

                {/* Render Wildlife Milestones */}
                {trees?.some(t => t.wildlifeUnlocked === "fox") && (
                  renderFox(32, 58)
                )}
              </svg>

              {/* Pollen Particles & Falling Leaves Overlay (Dark Sky Layering style) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
                {pollenParticles.map((p) => (
                  <div
                    key={`pollen-${p.id}`}
                    className="absolute rounded-full bg-yellow-400/60 animate-pollen"
                    style={{
                      left: `${p.left}%`,
                      top: `${p.top}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      filter: "blur(0.5px)",
                      "--op": p.opacity,
                      "--dur": `${p.duration}s`,
                      "--delay": `${p.delay}s`,
                    } as React.CSSProperties}
                  />
                ))}

                {leafParticles.map((l) => (
                  <svg
                    key={`leaf-${l.id}`}
                    className="absolute animate-leaf-fall text-current"
                    style={{
                      left: `${l.left}%`,
                      top: "-5%",
                      width: `${l.size}px`,
                      height: `${l.size}px`,
                      "--op": l.opacity,
                      "--dur": `${l.duration}s`,
                      "--delay": `${l.delay}s`,
                      color: l.color,
                    } as React.CSSProperties}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 3H21V7C21 14 14 21 7 21H3V17C3 10 10 3 17 3Z" />
                  </svg>
                ))}
              </div>
            </>
          )}

          {/* Hover Tooltip Overlay */}
          <AnimatePresence>
            {hoveredTree && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm border border-border-custom p-3.5 rounded-custom-btn shadow-md text-left z-20 flex flex-col gap-1 pointer-events-none"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase tracking-wider">
                  <span>Planted {new Date(hoveredTree.plantedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  <span className="text-moss font-extrabold">{hoveredTree.co2eRepresentedKg} kg CO₂ saved</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-soil flex items-center gap-1.5 capitalize">
                  {hoveredTree.treeSpecies} Tree
                  {hoveredTree.isMilestone && (
                    <span className="text-[9px] font-black text-clay bg-clay/10 rounded-full px-2 py-0.5 uppercase tracking-wide">
                      ★ MILESTONE
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-muted leading-tight">
                  Grown from reducing carbon in <strong className="text-soil">{hoveredTree.reductionCategory}</strong>.
                  {hoveredTree.wildlifeUnlocked && ` Unlocked a local ${hoveredTree.wildlifeUnlocked} in your forest meadow!`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Forest Progress Footer */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between text-xs font-bold text-muted uppercase">
            <span>Next Tree Seedling</span>
            <span>{progressToNextTree}% ({progressToNextTree} / 100 kg)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-soil/5 dark:bg-soil/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-moss transition-all duration-500 ease-out"
              style={{ width: `${progressToNextTree}%` }}
            />
          </div>
          <span className="text-[10px] text-muted text-center mt-1 leading-relaxed max-w-xs mx-auto">
            🌱 Every 100 kg of cumulative carbon saved plants another tree. Every 10th tree unlocks native wildlife to populate your meadow!
          </span>
        </div>
      </div>
    </Card>
  );
}
