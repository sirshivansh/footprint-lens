"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { AccuracyMeter } from "@/components/carbon/accuracy-meter";
import { motion } from "framer-motion";

export default function AccuracyPage() {
  const router = useRouter();
  const [footprintTons, setFootprintTons] = useState<string>("8.30");

  useEffect(() => {
    // Get estimated footprint from session storage
    const storedFootprint = sessionStorage.getItem("estimatedAnnualCo2eKg");
    if (storedFootprint) {
      const kg = parseFloat(storedFootprint);
      setFootprintTons((kg / 1000).toFixed(2));
    }
  }, []);

  const handleNext = () => {
    router.push("/lens-preview");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="p-8 border-border-custom bg-surface text-center flex flex-col items-center gap-8 shadow-md">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-xs font-bold tracking-widest text-muted uppercase font-sans">
            Step 3: Carbon Fidelity
          </span>
          <h2 className="font-serif text-3xl font-bold text-soil">
            Footprint Fidelity
          </h2>
        </div>

        {/* Accuracy Gauge */}
        <AccuracyMeter score={78} size={180} />

        {/* Insight Details */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="rounded-custom-btn bg-background/50 border border-border-custom px-4 py-3 font-sans">
            <span className="text-sm text-muted block">Estimated Annual Footprint</span>
            <span className="font-mono text-3xl font-extrabold text-soil">
              {footprintTons} <span className="text-base font-normal">tons CO₂e</span>
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            By automatically analyzing your profile choices and seeding your simulated bank transactions, we've increased your footprint accuracy from <strong>55%</strong> to <strong>78%</strong>!
          </p>
        </div>

        {/* CTA Button */}
        <Button size="lg" onClick={handleNext} className="w-full text-base font-bold tracking-wide">
          SEE LENS PREVIEW →
        </Button>
      </Card>
    </motion.div>
  );
}
