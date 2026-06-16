"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { Camera, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LensPreviewPage() {
  const router = useRouter();

  const handleNext = () => {
    // Complete onboarding, redirect to dashboard home
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="p-8 border-border-custom bg-surface flex flex-col gap-6 shadow-md text-center items-center">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-xs font-bold tracking-widest text-muted uppercase font-sans">
            Step 4: Radical Transparency
          </span>
          <h2 className="font-serif text-3xl font-bold text-soil">
            This is your Lens.
          </h2>
        </div>

        {/* Mock AR Camera View Frame */}
        <div className="relative overflow-hidden w-full aspect-[4/3] rounded-2xl border border-border-custom bg-soil/5 flex items-center justify-center">
          {/* Simulated Living Room Background Image */}
          <div className="absolute inset-0 bg-cover bg-center opacity-40 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80')]" />
          
          {/* Translucent overlay balloons (representing CO2) */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative w-full h-full">
              {/* Balloon 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 h-16 w-16 rounded-full bg-clay/20 border border-clay/40 backdrop-blur-sm flex items-center justify-center text-xs font-mono text-clay font-bold shadow-inner"
              >
                12kg
              </motion.div>
              {/* Balloon 2 */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full bg-moss/20 border border-moss/40 backdrop-blur-sm flex items-center justify-center text-xs font-mono text-moss font-bold shadow-inner"
              >
                3.2kg
              </motion.div>
              {/* Balloon 3 */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-1/3 h-24 w-24 rounded-full bg-sky/20 border border-sky/40 backdrop-blur-sm flex items-center justify-center text-xs font-mono text-sky font-bold shadow-inner"
              >
                25kg
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm border border-border-custom p-3 rounded-custom-btn flex items-center gap-2.5 text-left">
            <Camera className="h-5 w-5 text-clay shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-soil">Your October Footprint</span>
              <span className="text-[10px] text-muted">Translucent balloons float in your room.</span>
            </div>
          </div>
        </div>

        {/* Descriptive Text */}
        <p className="text-sm text-muted leading-relaxed max-w-sm">
          See your carbon footprint mapped into physical space. E.g., your monthly electricity usage visualized as gas volumes or melting Arctic ice. Tangible. Real. Yours.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <Button size="lg" onClick={handleNext} className="w-full text-base font-bold tracking-wide">
            ENTER DASHBOARD →
          </Button>
          <button
            onClick={handleNext}
            className="text-xs text-muted hover:text-soil transition-colors font-sans py-2 font-semibold"
          >
            Skip camera setup for now
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
