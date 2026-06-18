"use client";

import React, { useState, useEffect } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Skeleton } from "@/components/ui";
import { User, Mail, Lock, ShieldCheck, Sun, Moon, Bell, Sparkles, Award, Landmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const utils = trpc.useUtils();
  const { data: profileData, isLoading } = trpc.profile.getProfile.useQuery();

  const updatePrefMutation = trpc.profile.updatePreferences.useMutation();
  const promoteMutation = trpc.profile.promoteAccount.useMutation();

  // Preferences state
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifFreq, setNotifFreq] = useState<"daily" | "weekly" | "monthly" | "never">("weekly");
  const [prefSuccess, setPrefSuccess] = useState(false);

  // Upgrade account state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [promoteError, setPromoteError] = useState("");
  const [promoteSuccess, setPromoteSuccess] = useState("");

  // Sync state with db loaded data
  useEffect(() => {
    if (profileData?.preferences) {
      setTheme((profileData.preferences.theme as any) || "light");
      setNotifFreq((profileData.preferences.notificationFrequency as any) || "weekly");
    }
  }, [profileData]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSuccess(false);

    try {
      await updatePrefMutation.mutateAsync({
        theme,
        notificationFrequency: notifFreq,
      });
      setPrefSuccess(true);
      // Toggle HTML class for dark mode immediately
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setTimeout(() => setPrefSuccess(false), 3000);
      utils.profile.getProfile.invalidate();
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoteError("");
    setPromoteSuccess("");
    if (!email.trim() || !password.trim()) return;

    try {
      const res = await promoteMutation.mutateAsync({
        email,
        password,
      });

      // Update next-auth session client-side
      await updateSession({
        email: res.email,
        isAnonymous: false,
      });

      setPromoteSuccess("Account upgraded successfully! Your session is now secure.");
      utils.profile.getProfile.invalidate();
    } catch (err: any) {
      setPromoteError(err.message || "Failed to promote account.");
    }
  };

  if (isLoading) {
    return (
      <PageShell maxWidth="sm">
        <Skeleton className="h-64 w-full rounded-custom-card animate-pulse" />
      </PageShell>
    );
  }

  const isAnonymous = session?.user && (session.user as any).isAnonymous;

  return (
    <PageShell maxWidth="sm">
      <div className="flex flex-col gap-6 font-sans">
        {/* Page Header */}
        <div className="text-center max-w-sm mx-auto mb-2">
          <h2 className="font-serif text-3xl font-bold text-soil">Account settings</h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Manage your carbon tracking preferences, audit your profile attributes, and secure your account.
          </p>
        </div>

        {/* Profile Audit Details Card */}
        <Card className="border border-border-custom bg-surface text-left">
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-clay/10 text-clay flex items-center justify-center">
                <User className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="font-serif text-base font-bold text-soil flex items-center gap-1.5">
                  Intelligence Profile
                </h3>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                  Audit parameters
                </span>
              </div>
            </div>

            {/* Score Ring indicator */}
            <div className="rounded-custom-btn border border-border-custom bg-background/50 p-4 flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-muted font-extrabold uppercase tracking-wide">
                  Calculated Accuracy
                </span>
                <span className="font-mono text-2xl font-black text-soil mt-0.5">
                  {profileData?.profile?.accuracyScore || 55}%
                </span>
                <span className="text-[10px] text-muted mt-1 leading-normal">
                  Connect data streams or scan receipts to improve carbon precision.
                </span>
              </div>
              <div className="relative h-12 w-12 rounded-full border border-clay/20 bg-clay/5 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-clay" />
              </div>
            </div>

            {/* Onboarding Choices list */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-2.5 rounded-custom-btn bg-background/30 border border-border-custom/30">
                <span className="text-[9px] text-muted font-bold uppercase">Diet Archetype</span>
                <span className="block font-bold text-soil capitalize mt-0.5">
                  {profileData?.profile?.dietType || "omnivore"}
                </span>
              </div>
              <div className="p-2.5 rounded-custom-btn bg-background/30 border border-border-custom/30">
                <span className="text-[9px] text-muted font-bold uppercase">Home Setting</span>
                <span className="block font-bold text-soil capitalize mt-0.5">
                  {profileData?.profile?.homeType || "apartment"}
                </span>
              </div>
              <div className="p-2.5 rounded-custom-btn bg-background/30 border border-border-custom/30">
                <span className="text-[9px] text-muted font-bold uppercase">Primary Transport</span>
                <span className="block font-bold text-soil capitalize mt-0.5">
                  {profileData?.profile?.primaryTransport || "car"}
                </span>
              </div>
              <div className="p-2.5 rounded-custom-btn bg-background/30 border border-border-custom/30">
                <span className="text-[9px] text-muted font-bold uppercase">Shopping Habits</span>
                <span className="block font-bold text-soil capitalize mt-0.5">
                  {profileData?.profile?.shoppingHabit || "average"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Manage Data Streams & Privacy */}
        <div className="grid grid-cols-2 gap-3.5 font-sans">
          <Card
            onClick={() => router.push("/profile/data-sources")}
            className="border border-border-custom bg-surface p-4 flex flex-col justify-between text-left hover:border-clay/40 transition-all cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-clay" />
              <span className="font-serif text-sm font-bold text-soil">Data Sources</span>
            </div>
            <span className="text-[10px] text-muted mt-1.5 leading-normal">
              Manage synced bank accounts and receipt streams.
            </span>
          </Card>
          
          <Card
            onClick={() => router.push("/profile/privacy")}
            className="border border-border-custom bg-surface p-4 flex flex-col justify-between text-left hover:border-clay/40 transition-all cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-moss" />
              <span className="font-serif text-sm font-bold text-soil">Privacy Center</span>
            </div>
            <span className="text-[10px] text-muted mt-1.5 leading-normal">
              Sovereign controls for pause, export, and erase.
            </span>
          </Card>
        </div>

        {/* Anonymous Promo Form Card */}
        {isAnonymous && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-clay/30 bg-clay/5 text-left shadow-md">
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-clay/10 text-clay flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-serif text-base font-bold text-soil flex items-center gap-1.5">
                      Save Your Forest
                    </h3>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wide">
                      Upgrade to permanent account
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  You are browsing under an anonymous guest session. Register with an email to lock in your carbon ledger, trees planted, and cohort squad memberships forever.
                </p>

                {promoteError && (
                  <div className="rounded-custom-btn border border-ember/20 bg-ember/5 p-3 text-xs text-ember font-semibold">
                    {promoteError}
                  </div>
                )}
                {promoteSuccess && (
                  <div className="rounded-custom-btn border border-moss/20 bg-moss/5 p-3 text-xs text-moss font-semibold">
                    {promoteSuccess}
                  </div>
                )}

                {!promoteSuccess && (
                  <form onSubmit={handlePromote} className="flex flex-col gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-muted uppercase">Email Address</label>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9.5 text-sm h-10"
                        />
                        <Mail className="h-4 w-4 text-muted/65 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-muted uppercase">Password</label>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9.5 text-sm h-10"
                        />
                        <Lock className="h-4 w-4 text-muted/65 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      isLoading={promoteMutation.isPending}
                      className="w-full font-bold bg-clay border-clay mt-1.5"
                    >
                      SECURE MY ACCOUNT
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Regular Settings Form Card */}
        <Card className="border border-border-custom bg-surface text-left">
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-border-custom/30 pb-3">
              <div className="h-9 w-9 rounded-full bg-moss/10 text-moss flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="font-serif text-base font-bold text-soil">Preferences</h3>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wide">
                  Application preferences
                </span>
              </div>
            </div>

            <form onSubmit={handleSavePreferences} className="flex flex-col gap-4">
              {/* Theme Settings */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold text-muted uppercase">Interface Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 rounded-custom-btn border text-xs font-semibold select-none cursor-pointer transition-colors",
                      theme === "light"
                        ? "border-clay bg-clay/5 text-soil"
                        : "border-border-custom bg-background/30 text-muted"
                    )}
                  >
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 rounded-custom-btn border text-xs font-semibold select-none cursor-pointer transition-colors",
                      theme === "dark"
                        ? "border-clay bg-clay/5 text-soil"
                        : "border-border-custom bg-background/30 text-muted"
                    )}
                  >
                    <Moon className="h-4 w-4" />
                    Midnight Mode
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="flex flex-col gap-2.5 pt-1">
                <label className="text-[10px] font-bold text-muted uppercase">Pulse Notifications</label>
                <select
                  value={notifFreq}
                  onChange={(e: any) => setNotifFreq(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-custom-btn border border-border-custom bg-background focus:outline-none focus:ring-1 focus:ring-clay/50 text-soil font-sans"
                >
                  <option value="daily">Daily Carbon Brief</option>
                  <option value="weekly">Weekly Pulse Digest</option>
                  <option value="monthly">Monthly Footprint Report</option>
                  <option value="never">Muted (Never)</option>
                </select>
              </div>

              {prefSuccess && (
                <div className="text-xs text-moss font-bold text-center mt-1">
                  ✓ Preferences synced successfully!
                </div>
              )}

              <Button
                type="submit"
                isLoading={updatePrefMutation.isPending}
                className="w-full font-bold mt-2"
              >
                SAVE PREFERENCES
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
