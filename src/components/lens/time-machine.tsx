"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { formatCO2 } from "@/lib/format";
import { EASING } from "@/lib/constants";

interface TimeMachineDataPoint {
  date: string;
  co2eKg: number;
}

export interface TimeMachineProps {
  history: TimeMachineDataPoint[];
  projected?: TimeMachineDataPoint[];
  className?: string;
}

export function TimeMachine({ history, projected = [], className }: TimeMachineProps) {
  const allPoints = [...history, ...projected];
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(history.length - 1);
  const [isDragging, setIsDragging] = useState(false);

  const maxCo2 = Math.max(...allPoints.map((p) => p.co2eKg), 1);
  const activePoint = allPoints[activeIndex];
  const isProjected = activeIndex >= history.length;

  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      const index = Math.round(percent * (allPoints.length - 1));
      setActiveIndex(index);
    },
    [isDragging, allPoints.length]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      const index = Math.round(percent * (allPoints.length - 1));
      setActiveIndex(index);
    },
    [allPoints.length]
  );

  const formatted = activePoint ? formatCO2(activePoint.co2eKg) : null;

  // Format date label
  const getLabel = (dateStr: string) => {
    const d = new Date(dateStr + "-01");
    return d.toLocaleDateString("en-US", { month: "short" });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Active value display */}
      {formatted && activePoint && (
        <div className="text-center">
          <motion.span
            key={activePoint.co2eKg}
            initial={{ opacity: 0.5, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "font-mono text-3xl font-black block",
              isProjected ? "text-sky" : "text-soil"
            )}
          >
            {formatted.value}
          </motion.span>
          <span className="text-sm font-semibold text-muted">{formatted.unit}</span>
          {isProjected && (
            <span className="block text-xs text-sky font-semibold mt-1">
              Projected
            </span>
          )}
        </div>
      )}

      {/* Timeline visualization */}
      <div
        className="relative h-24 flex items-end gap-px"
        role="slider"
        aria-label="Time machine timeline"
        aria-valuemin={0}
        aria-valuemax={allPoints.length - 1}
        aria-valuenow={activeIndex}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setActiveIndex(Math.min(allPoints.length - 1, activeIndex + 1));
          if (e.key === "ArrowLeft") setActiveIndex(Math.max(0, activeIndex - 1));
        }}
      >
        {allPoints.map((point, i) => {
          const heightPercent = (point.co2eKg / maxCo2) * 100;
          const isActive = i === activeIndex;
          const isFuture = i >= history.length;

          return (
            <motion.div
              key={point.date}
              className={cn(
                "flex-1 rounded-t-sm cursor-pointer transition-colors duration-150",
                isActive
                  ? isFuture
                    ? "bg-sky"
                    : "bg-clay"
                  : isFuture
                    ? "bg-sky/20"
                    : "bg-soil/15 dark:bg-soil/20"
              )}
              style={{ height: `${Math.max(4, heightPercent)}%` }}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scaleY: 1.05 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}
      </div>

      {/* Scrubber track */}
      <div
        ref={trackRef}
        className="relative h-8 cursor-pointer select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
        onClick={handleTrackClick}
      >
        {/* Track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border-custom -translate-y-1/2" />

        {/* History portion */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-soil/30 -translate-y-1/2"
          style={{ width: `${(history.length / allPoints.length) * 100}%` }}
        />

        {/* Scrubber dot */}
        <motion.div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-surface shadow-md",
            isProjected ? "bg-sky" : "bg-clay"
          )}
          style={{
            left: `${(activeIndex / (allPoints.length - 1)) * 100}%`,
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
          transition={EASING.spring}
        />

        {/* Date labels */}
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between">
          {allPoints.length > 0 && (
            <>
              <span className="text-[10px] font-semibold text-muted">
                {getLabel(allPoints[0].date)}
              </span>
              <span className="text-[10px] font-semibold text-muted">
                {getLabel(allPoints[allPoints.length - 1].date)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Swipe hint */}
      <p className="text-xs text-muted text-center mt-2 font-sans">
        ← Swipe to see your projected future if you keep going →
      </p>
    </div>
  );
}
