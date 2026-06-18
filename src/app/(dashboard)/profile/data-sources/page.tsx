"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent, Button, Dialog } from "@/components/ui";
import { trpc } from "@/lib/trpc/client";
import { useUIStore } from "@/stores/ui-store";
import { Landmark, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Building, FileSpreadsheet, Plus } from "lucide-react";
import { motion } from "framer-motion";

const mockBanks = [
  { id: "evergreen", name: "Evergreen Credit Union", desc: "Green finance & carbon-tracking support" },
  { id: "oakwood", name: "Oakwood National Bank", desc: "Community-driven eco-investment banking" },
  { id: "leaflet", name: "Leaflet Financial", desc: "Sustainable asset building & green loans" },
  { id: "summit", name: "Summit Mutual", desc: "Eco-conscious capital management" },
];

export default function DataSourcesPage() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const utils = trpc.useUtils();

  const { data: profileData, isLoading } = trpc.profile.getProfile.useQuery();
  const connectMutation = trpc.profile.connectBank.useMutation();
  const disconnectMutation = trpc.profile.disconnectBank.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0); // 0=select, 1=syncing, 2=complete
  const [selectedBank, setSelectedBank] = useState("");

  const handleConnectBank = async (bank: typeof mockBanks[0]) => {
    setSelectedBank(bank.name);
    setConnectionStep(1); // syncing
    
    setTimeout(async () => {
      try {
        await connectMutation.mutateAsync();
        setConnectionStep(2);
        setTimeout(() => {
          setIsDialogOpen(false);
          addToast({
            type: "success",
            title: "Bank Connected",
            description: `${bank.name} synced successfully. Footprint accuracy is now 92%.`,
            duration: 5000,
          });
          utils.profile.getProfile.invalidate();
        }, 1000);
      } catch (err) {
        console.error("Failed to connect bank:", err);
        setConnectionStep(0);
        addToast({
          type: "error",
          title: "Connection Failed",
          description: "Secure handshake failed. Please try again.",
        });
      }
    }, 2000);
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect your financial account? This will lower your carbon ledger fidelity back to 78%.")) return;
    
    try {
      await disconnectMutation.mutateAsync();
      addToast({
        type: "success",
        title: "Account Disconnected",
        description: "Financial stream detached. Carbon fidelity reset to 78%.",
      });
      utils.profile.getProfile.invalidate();
    } catch (err) {
      console.error("Failed to disconnect bank:", err);
    }
  };

  const openConnectDialog = () => {
    setSelectedBank("");
    setConnectionStep(0);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <PageShell maxWidth="sm">
        <div className="h-64 w-full rounded-custom-card bg-surface animate-pulse" />
      </PageShell>
    );
  }

  const isConnected = (profileData?.profile?.accuracyScore || 55) >= 92;

  return (
    <PageShell maxWidth="sm">
      <div className="flex flex-col gap-6 font-sans text-left">
        {/* Navigation / Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/profile")}
            className="h-9 w-9 p-0 flex items-center justify-center rounded-custom-btn border-border-custom"
            aria-label="Back to settings"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-soil" />
          </Button>
          <div className="flex flex-col">
            <h2 className="font-serif text-2xl font-bold text-soil">Data Sources</h2>
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
              Carbon Intelligence Pipelines
            </span>
          </div>
        </div>

        {/* Sync Status Info Card */}
        <Card className="border border-border-custom bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-clay" />
                <h3 className="font-serif text-lg font-bold text-soil">
                  Financial Sync
                </h3>
              </div>
              <span className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 uppercase ${
                isConnected ? "bg-moss/10 text-moss" : "bg-clay/10 text-clay"
              }`}>
                {isConnected ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed font-sans">
              Connect your account logs to automatically classify merchant carbon intensities. We sync metadata anonymously without querying account balances or credentials.
            </p>

            {isConnected ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-moss/5 border border-moss/20 rounded-custom-btn flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-moss shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-soil">Evergreen Credit Union Linked</span>
                    <span className="text-[10px] text-muted">Last synced: Just now · Fidelity: 92%</span>
                  </div>
                </div>
                <Button
                  onClick={handleDisconnect}
                  isLoading={disconnectMutation.isPending}
                  className="w-full text-xs font-bold bg-background border border-border-custom text-ember hover:bg-ember/5"
                >
                  DISCONNECT FINANCIAL STREAM
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-soil/5 border border-border-custom rounded-custom-btn flex items-center gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-clay shrink-0" />
                  <span className="text-[10px] text-muted leading-relaxed">
                    No active account linked. Your current estimates are derived from onboarding archetype approximations (78% fidelity).
                  </span>
                </div>
                <Button
                  onClick={openConnectDialog}
                  className="w-full text-xs font-bold bg-clay border-clay flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  CONNECT BANK ACCOUNT (+14% BOOST)
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Paper Receipt Scanner Card */}
        <Card className="border border-border-custom bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-moss" />
                <h3 className="font-serif text-base font-bold text-soil">
                  WASM OCR Scanning
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-moss/10 text-moss rounded-full px-2.5 py-0.5 uppercase">
                Active Fallback
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Paper receipts carry detailed line-item categories (like almond vs oat milk) that standard bank merchant statements lack.
            </p>

            <Button
              onClick={() => router.push("/receipts")}
              className="w-full text-xs font-bold bg-moss border-moss"
            >
              LAUNCH RECEIPT SCANNER →
            </Button>
          </div>
        </Card>
      </div>

      {/* Simulated Bank Sync Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => connectionStep !== 1 && setIsDialogOpen(false)}
        title={connectionStep === 1 ? "Establishing Sync..." : connectionStep === 2 ? "Sync Complete" : "Connect Financial Account"}
        description={connectionStep === 0 ? "Select a bank partner to sync anonymous carbon metadata." : undefined}
      >
        {connectionStep === 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-start gap-2.5 p-3 bg-soil/5 border border-border-custom rounded-custom-btn text-left mb-1 font-sans">
              <ShieldCheck className="h-5 w-5 text-clay shrink-0 mt-0.5" />
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
                  <div className="flex items-center gap-3 font-sans">
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
          <div className="flex flex-col items-center justify-center py-12 text-center gap-6 font-sans">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-clay/20 border-t-clay animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building className="h-4 w-4 text-clay" />
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
          <div className="flex flex-col items-center justify-center py-12 text-center gap-6 font-sans">
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
    </PageShell>
  );
}
