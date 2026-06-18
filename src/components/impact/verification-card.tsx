"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/cn";
import { EASING } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export interface VerificationCardProps {
  project: {
    partner: string;
    projectName: string;
    certificateId?: string;
    verificationUrl?: string;
    co2eOffsetKg?: number;
    areaProtectedAcres?: number;
    satelliteImageUrl?: string;
    verifiedDate?: string;
  };
  index?: number;
  className?: string;
}

export function VerificationCard({ project, index = 0, className }: VerificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ...EASING.spring }}
    >
      <Card className={cn("overflow-hidden", className)}>
        {/* Satellite image placeholder */}
        <div className="h-36 bg-gradient-to-br from-moss/20 via-sky/10 to-moss/5 flex items-center justify-center">
          {project.satelliteImageUrl ? (
            <img
              src={project.satelliteImageUrl}
              alt={`Satellite view of ${project.projectName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <span className="text-4xl" role="img" aria-hidden="true">
                🛰️
              </span>
              <span className="text-xs font-semibold">Satellite imagery</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col gap-3">
          {/* Partner & project info */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-serif text-base font-semibold text-soil">
                {project.projectName}
              </p>
              <p className="text-xs text-muted font-sans">
                {project.partner}
                {project.certificateId && ` · ${project.certificateId}`}
              </p>
            </div>
            <div className="flex items-center gap-1 text-moss shrink-0">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold">Verified</span>
            </div>
          </div>

          {/* Stats */}
          {(project.co2eOffsetKg || project.areaProtectedAcres) && (
            <div className="flex gap-4 text-xs font-mono font-bold">
              {project.co2eOffsetKg && (
                <span className="text-soil">
                  {(project.co2eOffsetKg / 1000).toFixed(1)}t offset
                </span>
              )}
              {project.areaProtectedAcres && (
                <span className="text-moss">
                  {project.areaProtectedAcres.toFixed(0)} acres
                </span>
              )}
            </div>
          )}

          {/* Verification date */}
          {project.verifiedDate && (
            <p className="text-xs text-muted">
              Verified: {formatDate(project.verifiedDate, { includeYear: true })}
            </p>
          )}

          {/* View certificate link */}
          {project.verificationUrl && (
            <a
              href={project.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-clay hover:text-clay/80 transition-colors"
            >
              VIEW CERTIFICATE
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
