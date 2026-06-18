"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Dialog } from "@/components/ui";
import { AccuracyMeter } from "@/components/carbon/accuracy-meter";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useUIStore } from "@/stores/ui-store";
import { trpc } from "@/lib/trpc/client";
import { motion } from "framer-motion";
import { Shield, Sparkles, Building, CheckCircle2, Landmark } from "lucide-react";

const mockBanks = [
  { id: "evergreen", name: "Evergreen Credit Union", desc: "Green finance & carbon-tracking support" },
  { id: "oakwood", name: "Oakwood National Bank", desc: "Community-driven eco-investment banking" },
  { id: "leaflet", name: "Leaflet Financial", desc: "Sustainable asset building & green loans" },
  { id: "summit", name: "Summit Mutual", desc: "Eco-conscious capital management" },
];

export default function AccuracyPage() {
  const router = useRouter();
  const { setStep } = useOnboardingStore();
  const addToast = useUIStore((s) => s.addToast);
  const connectBankMutation = trpc.profile.connectBank.useMutation();
  
  const [footprintTons, setFootprintTons] = useState<string>("8.30");
  const [isBankConnected, setIsBankConnected] = useState<boolean>(false);
  const [connectedBankName, setConnectedBankName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [connectingBankId, setConnectingBankId] = useState<string | null>(null);
  const [connectionStep, setConnectionStep] = useState<number>(0); // 0=select, 1=syncing, 2=complete

  useEffect(() => {
    setStep(2);
    // Get estimated footprint from session storage
    const storedFootprint = sessionStorage.getItem("estimatedAnnualCo2eKg");
    if (storedFootprint) {
      const kg = parseFloat(storedFootprint);
      setFootprintTons((kg / 1000).toFixed(2));
    }
  }, [setStep]);

  const handleNext = () => {
    router.push("/lens-preview");
  };

  const handleConnectBank = (bank: typeof mockBanks[0]) => {
    setConnectingBankId(bank.id);
    setConnectionStep(1); // syncing
    
    // Simulate Plaid bank connection stages
    setTimeout(async () => {
      try {
        await connectBankMutation.mutateAsync();
        setConnectionStep(2); // complete
        setTimeout(() => {
          setIsDialogOpen(false);
          setIsBankConnected(true);
          setConnectedBankName(bank.name);
          addToast({
            type: "success",
            title: "Fidelity Boosted!",
            description: `${bank.name} synced. Fidelity increased to 92%.`,
            duration: 5000,
          });
        }, 1000);
      } catch (err) {
        console.error("Failed to connect bank via backend:", err);
        setConnectionStep(0);
        addToast({
          type: "error",
          title: "Connection Failed",
          description: "Could not link bank. Please try again.",
        });
      }
    }, 2000);
  };

  const openBankDialog = () => {
    setConnectingBankId(null);
    setConnectionStep(0);
    setIsDialogOpen(true);
  };

  return (
    <OnboardingStep
      step={3}
      totalSteps={4}
      showBack={true}
      onBack={() => router.push("/profile-setup")}
      onSkip={handleNext}
      skipLabel="Skip integration for now"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="p-8 border-border-custom bg-surface text-center flex flex-col items-center gap-6 shadow-md">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs font-bold tracking-widest text-muted uppercase font-sans">
              Step 3: Carbon Fidelity
            </span>
            <h2 className="font-serif text-3xl font-bold text-soil">
              Footprint Fidelity
            </h2>
          </div>

          {/* Accuracy Gauge */}
          <div className="relative">
            <AccuracyMeter score={isBankConnected ? 92 : 78} size={180} />
            {isBankConnected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-moss text-white text-[11px] font-sans font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap"
              >
                <CheckCircle2 className="h-3 w-3" />
                {connectedBankName} Synced
              </motion.div>
            )}
          </div>

          {/* Insight Details */}
          <div className="flex flex-col gap-4 max-w-sm w-full mt-2">
            <div className="rounded-custom-btn bg-background/50 border border-border-custom px-4 py-3 font-sans">
              <span className="text-xs text-muted block mb-0.5">Estimated Annual Footprint</span>
              <span className="font-mono text-3xl font-extrabold text-soil">
                {footprintTons} <span className="text-base font-normal">tons CO₂e</span>
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed font-sans">
              {isBankConnected ? (
                <>
                  Awesome! Synced transaction logs verify your emission spikes. We've refined your carbon ledger to <strong className="text-soil">92% accuracy</strong>, matching actual utility rates and regional grid intensities.
                </>
              ) : (
                <>
                  By analyzing your starting choices, we've estimated your footprint with <strong className="text-soil">78% accuracy</strong>. Synced transaction categories boost accuracy to <strong className="text-soil">92%</strong> via auto-matching emission factors.
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full mt-2">
            {!isBankConnected ? (
              <>
                <Button
                  size="lg"
                  onClick={openBankDialog}
                  className="w-full text-sm font-bold tracking-wide flex items-center justify-center gap-2"
                >
                  <Landmark className="h-4 w-4" />
                  CONNECT SECURE BANK ACCOUNT
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleNext}
                  className="w-full text-sm font-bold tracking-wide text-soil"
                >
                  CONTINUE WITHOUT SYNC →
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={handleNext}
                className="w-full text-sm font-bold tracking-wide bg-moss hover:bg-moss/90 text-white flex items-center justify-center gap-2"
              >
                CONTINUE TO LENS PREVIEW →
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Simulated Plaid Link Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => connectionStep !== 1 && setIsDialogOpen(false)}
        title={connectionStep === 1 ? "Establishing Sync..." : connectionStep === 2 ? "Sync Complete" : "Connect Financial Account"}
        description={connectionStep === 0 ? "Select a bank partner to sync anonymous carbon metadata." : undefined}
      >
        {connectionStep === 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-start gap-2.5 p-3 bg-soil/5 border border-border-custom rounded-custom-btn text-left mb-1">
              <Shield className="h-5 w-5 text-clay shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-soil">Radical Privacy Policy</span>
                <span className="text-[10px] text-muted leading-relaxed">
                  Credentials are processed locally. Footprint Lens only queries carbon category codes, not balances, name, or account numbers.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {mockBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleConnectBank(bank)}
                  className="flex items-center justify-between p-3 border border-border-custom bg-background/50 hover:bg-soil/5 rounded-custom-btn text-left transition-colors focus:ring-2 focus:ring-clay focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-clay/10 text-clay">
                      <Building className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-soil">{bank.name}</span>
                      <span className="text-[10px] text-muted">{bank.desc}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {connectionStep === 1 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-clay/20 border-t-clay animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="h-4 w-4 text-clay" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-serif text-base font-bold text-soil">
                Analyzing carbon pulse...
              </span>
              <span className="text-xs text-muted max-w-[280px]">
                Securing data handshake. Simulating merchant ledger emissions vectors.
              </span>
            </div>
          </div>
        )}

        {connectionStep === 2 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss/10 text-moss animate-bounce">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-serif text-base font-bold text-soil">
                Connection Complete
              </span>
              <span className="text-xs text-muted">
                Metadata synced successfully! Preparing your custom dashboard.
              </span>
            </div>
          </div>
        )}
      </Dialog>
    </OnboardingStep>
  );
}
