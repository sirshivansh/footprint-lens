"use client";

import React, { useState } from "react";
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

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-custom-card animate-pulse" />;
  }

  const plantedCount = trees?.length || 0;
  const totalSaved = profileData?.profile?.totalCo2ReducedKg 
    ? parseFloat(profileData.profile.totalCo2ReducedKg.toString()) 
    : 0;
  const progressToNextTree = Math.round(totalSaved % 100);

  // Render tree SVG based on species
  const renderTreeSVG = (species: string, isMilestone: boolean) => {
    const scale = isMilestone ? 1.25 : 1.0;
    
    switch (species.toLowerCase()) {
      case "birch": // transport
        return (
          <g transform={`scale(${scale})`}>
            {/* Trunk */}
            <rect x="-1.5" y="0" width="3" height="18" fill="#EAE6DF" rx="0.5" stroke="#4A4A4A" strokeWidth="0.25" />
            {/* Birch black notch lines */}
            <line x1="-1.5" y1="4" x2="0.5" y2="4.5" stroke="#333" strokeWidth="0.3" />
            <line x1="-0.5" y1="9" x2="1.5" y2="9.5" stroke="#333" strokeWidth="0.3" />
            {/* Canopy */}
            <ellipse cx="0" cy="-6" rx="8" ry="11" fill="#78B159" opacity="0.9" />
            <ellipse cx="-4" cy="-5" rx="5" ry="7" fill="#699D4B" opacity="0.95" />
            <ellipse cx="3" cy="-7" rx="5" ry="7" fill="#84C362" opacity="0.85" />
          </g>
        );
      case "pine": // energy
        return (
          <g transform={`scale(${scale})`}>
            {/* Trunk */}
            <rect x="-2" y="0" width="4" height="14" fill="#5C4033" rx="0.5" />
            {/* Needles (triangles) */}
            <polygon points="0,-18 -10,-6 10,-6" fill="#1E4620" />
            <polygon points="0,-12 -8,-1 8,-1" fill="#2E5A30" />
            <polygon points="0,-6 -6,4 6,4" fill="#3D7040" />
          </g>
        );
      case "spruce": // shopping
        return (
          <g transform={`scale(${scale})`}>
            {/* Trunk */}
            <rect x="-1.5" y="0" width="3" height="12" fill="#4A3B32" />
            {/* Layers */}
            <polygon points="0,-16 -8,-7 8,-7" fill="#2D4D43" />
            <polygon points="0,-10 -7,-2 7,-2" fill="#385F53" />
            <polygon points="0,-4 -6,4 6,4" fill="#447365" />
          </g>
        );
      case "cedar": // other
        return (
          <g transform={`scale(${scale})`}>
            {/* Trunk */}
            <rect x="-2.5" y="0" width="5" height="10" fill="#6E473B" rx="0.5" />
            {/* Flat tiered branch plates */}
            <ellipse cx="0" cy="-4" rx="11" ry="3.5" fill="#34594B" />
            <ellipse cx="-2" cy="-9" rx="8" ry="3" fill="#3F6B5A" />
            <ellipse cx="1" cy="-14" rx="5" ry="2.5" fill="#4B806C" />
          </g>
        );
      case "oak": // diet (default)
      default:
        return (
          <g transform={`scale(${scale})`}>
            {/* Trunk */}
            <rect x="-3" y="0" width="6" height="16" fill="#654321" rx="1" />
            {/* Thick leafy canopy */}
            <circle cx="0" cy="-6" r="10" fill="#2A472E" />
            <circle cx="-6" cy="-4" r="8" fill="#1F3622" />
            <circle cx="6" cy="-5" r="8" fill="#365C3B" />
            <circle cx="0" cy="-12" r="7.5" fill="#3E6843" opacity="0.9" />
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
        <path d="M-16,-6 Q-14,-9 -12,-8 Z" fill="#F5EBE6" /> {/* Tip */}
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
    <Card className="border-border-custom bg-surface overflow-hidden shadow-md font-sans">
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

                {/* Render Trees. We sort by Y position so that trees in the front (higher Y) draw on top of trees in the back (lower Y) */}
                {[...(trees || [])]
                  .sort((a, b) => a.positionY - b.positionY)
                  .map((tree) => {
                    // Normalize position to fit SVG coordinates (0-100 x, 25-68 y for vertical depth placement)
                    // The original coords in DB are 0-100. We map X directly, and scale Y to occupy the ground field (30-68)
                    const x = tree.positionX;
                    const y = 25 + (tree.positionY * 0.43); // fits in 25 to 68 range

                    return (
                      <g
                        key={tree.id}
                        transform={`translate(${x}, ${y})`}
                        onMouseEnter={() => setHoveredTree(tree as unknown as Tree)}
                        onMouseLeave={() => setHoveredTree(null)}
                        className="cursor-pointer transition-all duration-200 hover:filter hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                      >
                        {renderTreeSVG(tree.treeSpecies, tree.isMilestone)}
                      </g>
                    );
                  })}

                {/* Render Wildlife Milestones */}
                {/* For demo purposes, if they have at least 10 trees, or they have a tree with wildlifeUnlocked, show the fox */}
                {trees?.some(t => t.wildlifeUnlocked === "fox") && (
                  // Position fox in front of a tree or at a fixed meadow spot
                  renderFox(32, 58)
                )}
              </svg>
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
