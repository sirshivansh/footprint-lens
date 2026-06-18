"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent, Button, Dialog } from "@/components/ui";
import { trpc } from "@/lib/trpc/client";
import { useUIStore } from "@/stores/ui-store";
import { signOut } from "next-auth/react";
import { ArrowLeft, Shield, EyeOff, Download, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const utils = trpc.useUtils();

  const { data: profileData, isLoading } = trpc.profile.getProfile.useQuery();
  const togglePauseMutation = trpc.profile.togglePauseMode.useMutation();
  const deleteMutation = trpc.profile.deleteAccount.useMutation();
  const { data: exportData } = trpc.profile.exportUserData.useQuery();

  const [isPaused, setIsPaused] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (profileData?.preferences) {
      setIsPaused(!!profileData.preferences.pauseMode);
    }
  }, [profileData]);

  const handleTogglePause = async () => {
    const nextState = !isPaused;
    try {
      await togglePauseMutation.mutateAsync({ paused: nextState });
      setIsPaused(nextState);
      addToast({
        type: "success",
        title: nextState ? "Tracking Paused" : "Tracking Active",
        description: nextState 
          ? "Ledger updates and bank integrations have been paused."
          : "Ledger updates resumed.",
      });
      utils.profile.getProfile.invalidate();
    } catch (err) {
      console.error("Failed to toggle pause mode:", err);
    }
  };

  const handleExport = () => {
    if (!exportData) {
      addToast({
        type: "error",
        title: "Export Failed",
        description: "No data available to export yet.",
      });
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `footprint_lens_ledger_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      type: "success",
      title: "Ledger Exported",
      description: "JSON carbon metadata file downloaded successfully.",
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync();
      addToast({
        type: "success",
        title: "Data Purged",
        description: "Your account and all associated carbon logs have been permanently erased.",
      });
      setIsDeleteDialogOpen(false);
      
      // Sign out and redirect to register/login page
      await signOut({ callbackUrl: "/welcome" });
    } catch (err) {
      console.error("Failed to delete account:", err);
      setIsDeleting(false);
      addToast({
        type: "error",
        title: "Erasure Failed",
        description: "Failed to delete account database records. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <PageShell maxWidth="sm">
        <div className="h-64 w-full rounded-custom-card bg-surface animate-pulse" />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="sm">
      <div className="flex flex-col gap-6 font-sans text-left">
        {/* Navigation / Title */}
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
            <h2 className="font-serif text-2xl font-bold text-soil">Privacy Sovereignty</h2>
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
              radical privacy controls
            </span>
          </div>
        </div>

        {/* Sovereign Statement */}
        <Card className="border border-border-custom bg-surface p-5 shadow-sm">
          <div className="flex gap-4">
            <Shield className="h-6 w-6 text-moss shrink-0" />
            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-base font-bold text-soil">Our Privacy Philosophy</h3>
              <p className="text-xs text-muted leading-relaxed">
                Carbon tracking shouldn't feel like surveillance. Footprint Lens is engineered so you own 100% of your data. Credentials and OCR details are parsed locally and sync anonymized keys without user identifiers.
              </p>
            </div>
          </div>
        </Card>

        {/* Pause Tracking Card */}
        <Card className="border border-border-custom bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-clay" />
                <h4 className="font-serif text-base font-bold text-soil">Pause carbon tracking</h4>
              </div>
              <button
                onClick={handleTogglePause}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors focus:outline-none ${
                  isPaused ? "bg-clay" : "bg-soil/15 dark:bg-soil/25"
                }`}
                aria-label="Toggle pause tracking"
              >
                <div className={`h-4.5 w-4.5 rounded-full bg-white transition-transform ${
                  isPaused ? "translate-x-5.5" : "translate-x-0"
                }`} />
              </button>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Temporarily freeze ledger scanning. When paused, newly simulated transactions or receipts uploads will not record carbon equivalences.
            </p>
          </div>
        </Card>

        {/* Data Portability Card */}
        <Card className="border border-border-custom bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-moss" />
              <h4 className="font-serif text-base font-bold text-soil">Data Portability (Export JSON)</h4>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Download your complete carbon ledger profile, onboarding choices, preferences, and mapped transaction metrics as a structured JSON object.
            </p>
            <Button
              onClick={handleExport}
              disabled={!exportData}
              className="w-full text-xs font-bold bg-moss border-moss flex items-center justify-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              EXPORT MY LEDGER
            </Button>
          </div>
        </Card>

        {/* Purge Account Card */}
        <Card className="border border-ember/25 bg-ember/3 p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-ember">
              <Trash2 className="h-5 w-5 shrink-0" />
              <h4 className="font-serif text-base font-bold">Erase All Carbon Footprints</h4>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Permanently delete your account profile, linked credentials, custom forest trees, cohort squads, and ledger ledger records. <strong>This action is irreversible.</strong>
            </p>
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full text-xs font-bold bg-ember hover:bg-ember/90 border-ember text-white"
            >
              DELETE ACCOUNT & WIPE DATA
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
        title="Confirm Data Erasure"
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-start gap-2.5 p-3 bg-ember/5 border border-ember/20 rounded-custom-btn text-left text-xs font-sans text-ember">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold">Permanent Deletion Warning</span>
              <span className="leading-relaxed mt-0.5">
                All carbon pulse charts, Living Forest trees planted, scanned receipts history, and squad connections will be immediately and permanently destroyed.
              </span>
            </div>
          </div>

          <p className="text-xs text-muted text-left font-sans leading-relaxed">
            Are you absolutely sure you want to proceed? You will be immediately logged out and redirect to welcome screen.
          </p>

          <div className="flex gap-3 mt-2 font-sans">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 font-bold text-soil h-10"
            >
              CANCEL
            </Button>
            <Button
              disabled={isDeleting}
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
              className="flex-1 font-bold bg-ember hover:bg-ember/95 border-ember text-white h-10"
            >
              CONFIRM DELETE
            </Button>
          </div>
        </div>
      </Dialog>
    </PageShell>
  );
}
