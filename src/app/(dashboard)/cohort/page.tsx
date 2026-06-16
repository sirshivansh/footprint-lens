"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Skeleton } from "@/components/ui";
import { Users, Plus, UserPlus, Copy, LogOut, Info, ShieldAlert, Award, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export default function CohortPage() {
  const utils = trpc.useUtils();
  const { data: cohortData, isLoading, refetch } = trpc.cohorts.get.useQuery();

  const createMutation = trpc.cohorts.create.useMutation();
  const joinMutation = trpc.cohorts.join.useMutation();
  const leaveMutation = trpc.cohorts.leave.useMutation();

  // Create Cohort Form State
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState<"friends_family" | "neighbors" | "workplace" | "interest">("friends_family");
  
  // Join Cohort Form State
  const [inviteCode, setInviteCode] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!createName.trim()) return;

    try {
      const res = await createMutation.mutateAsync({
        name: createName,
        type: createType,
      });
      setSuccessMsg(`Cohort created successfully! Share the code ${res.inviteCode} with others.`);
      utils.cohorts.get.invalidate();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create cohort.");
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!inviteCode.trim()) return;

    try {
      await joinMutation.mutateAsync({
        inviteCode: inviteCode.trim().toUpperCase(),
      });
      setSuccessMsg("Joined cohort successfully!");
      utils.cohorts.get.invalidate();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to join cohort.");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this cohort? Your quest contributions will be preserved, but you will leave this squad.")) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await leaveMutation.mutateAsync();
      setSuccessMsg("Left cohort successfully.");
      utils.cohorts.get.invalidate();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to leave cohort.");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <PageShell maxWidth="md">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 w-full rounded-custom-card" />
          <Skeleton className="h-64 w-full rounded-custom-card" />
        </div>
      </PageShell>
    );
  }

  // Helper to render abstract shape SVG
  const renderShapeIcon = (shape: string, color: string, className = "h-5 w-5") => {
    switch (shape) {
      case "square":
        return <div className={className} style={{ backgroundColor: color, borderRadius: "2px" }} />;
      case "triangle":
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ fill: color }}>
            <polygon points="50,15 90,85 10,85" />
          </svg>
        );
      case "hexagon":
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ fill: color }}>
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
          </svg>
        );
      case "pentagon":
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ fill: color }}>
            <polygon points="50,5 95,38 78,90 22,90 5,38" />
          </svg>
        );
      case "diamond":
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ fill: color }}>
            <polygon points="50,5 95,50 50,95 5,50" />
          </svg>
        );
      case "star":
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ fill: color }}>
            <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
          </svg>
        );
      case "circle":
      default:
        return <div className={cn(className, "rounded-full")} style={{ backgroundColor: color }} />;
    }
  };

  return (
    <PageShell maxWidth="md">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="text-center max-w-md mx-auto mb-2">
          <h2 className="font-serif text-3xl font-bold text-soil">Carbon Cohorts</h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Collaborative climate Action. Join forces with friends, family, or colleagues. Swap carbon together anonymously to complete group quests.
          </p>
        </div>

        {/* Global Messages */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-custom-btn border border-ember/20 bg-ember/5 p-4 text-xs text-ember font-semibold">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2.5 rounded-custom-btn border border-moss/20 bg-moss/5 p-4 text-xs text-moss font-semibold">
            <Award className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {cohortData ? (
          /* ACTIVE COHORT DISPLAY */
          <div className="flex flex-col gap-6 font-sans">
            {/* Cohort Card */}
            <Card className="border border-border-custom bg-surface relative overflow-hidden shadow-md">
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-muted font-bold tracking-widest uppercase">
                      {cohortData.cohort.type.replace("_", " ")} Squad
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-soil leading-tight">
                      {cohortData.cohort.name}
                    </h3>
                  </div>

                  <Button
                    onClick={handleLeave}
                    variant="outline"
                    className="text-xs text-ember border-ember/20 hover:bg-ember/5 h-8 font-semibold flex items-center gap-1.5 px-3 rounded-full shrink-0"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Leave
                  </Button>
                </div>

                {/* Invite Code Bar */}
                <div className="rounded-custom-btn border border-border-custom/80 bg-background/50 p-3 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-muted font-extrabold uppercase tracking-wide">
                      Share Invite Code
                    </span>
                    <span className="font-mono text-base font-black text-soil tracking-widest">
                      {cohortData.cohort.inviteCode}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleCopyCode(cohortData.cohort.inviteCode)}
                    className="h-8 text-xs font-bold bg-clay border-clay flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quests Progress Card */}
            {cohortData.activeQuests.map((quest) => {
              const target = parseFloat(quest.targetCo2eKg || "500.00");
              const current = parseFloat(quest.currentCo2eKg || "0.00");
              const pct = Math.min(100, Math.round((current / target) * 100));

              return (
                <Card key={quest.id} className="border border-border-custom bg-surface shadow-md">
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏆</span>
                        <div className="flex flex-col text-left">
                          <h4 className="font-serif text-base font-bold text-soil">
                            {quest.title}
                          </h4>
                          <span className="text-[9px] text-muted font-bold tracking-wide uppercase">
                            Active Quest
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-soil">
                        {current.toFixed(1)} / {target.toFixed(0)} <span className="text-[10px] text-muted">kg</span>
                      </span>
                    </div>

                    <p className="text-xs text-muted leading-relaxed text-left">
                      {quest.description}
                    </p>

                    {/* Progress bar */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="w-full h-2 rounded-full bg-soil/5 dark:bg-soil/15 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-moss transition-all duration-500 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-extrabold text-muted uppercase">
                        <span>Cohort goal progress</span>
                        <span>{pct}% Completed</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Members Section (Anonymous grid) */}
            <Card className="border border-border-custom bg-surface shadow-sm">
              <div className="p-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold tracking-widest text-muted uppercase text-left">
                  Squad Members ({cohortData.members.length} / {cohortData.cohort.maxMembers})
                </h4>

                <div className="flex flex-wrap gap-3.5 justify-start">
                  {cohortData.members.map((member) => (
                    <div
                      key={member.id}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-custom-btn border transition-all min-w-[70px]",
                        member.isSelf
                          ? "border-clay/40 bg-clay/5"
                          : "border-border-custom/50 bg-background/20"
                      )}
                    >
                      {/* Abstract Avatar Icon */}
                      <div className="h-10 w-10 rounded-full bg-background border border-border-custom/80 flex items-center justify-center shadow-inner shrink-0">
                        {renderShapeIcon(member.avatarShape, member.avatarColor, "h-4 w-4")}
                      </div>
                      <span className="text-[10px] font-bold text-soil">
                        {member.isSelf ? "You" : member.role === "creator" ? "Host" : "Member"}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted leading-tight border-t border-border-custom/30 pt-3 flex items-center gap-1.5 italic">
                  <Info className="h-3.5 w-3.5 text-muted shrink-0" />
                  To ensure psychological safety and eliminate carbon guilt, squad member names and exact leaderboards are hidden.
                </p>
              </div>
            </Card>

            {/* Anonymous Activity Feed */}
            <Card className="border border-border-custom bg-surface shadow-sm">
              <div className="p-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold tracking-widest text-muted uppercase text-left">
                  Cohort Cooperation Feed
                </h4>

                <div className="flex flex-col gap-3">
                  {cohortData.activityFeed.map((feedItem: any) => {
                    const timeAgo = new Date(feedItem.timestamp).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={feedItem.id}
                        className="flex items-center gap-3 p-2.5 rounded-custom-btn bg-background/30 border border-border-custom/30 text-left text-xs"
                      >
                        {/* Member avatar identifier */}
                        <div className="h-7 w-7 rounded-full bg-background border border-border-custom/50 flex items-center justify-center shrink-0">
                          {renderShapeIcon(feedItem.avatarShape, feedItem.avatarColor, "h-3 w-3")}
                        </div>

                        <div className="flex flex-col truncate w-full">
                          <span className="font-semibold text-soil leading-relaxed truncate">
                            {feedItem.text}
                          </span>
                          <span className="text-[9px] text-muted flex items-center gap-1 font-bold">
                            <Calendar className="h-2.5 w-2.5" />
                            {timeAgo}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* NO COHORT DISPLAY (CREATE / JOIN FORMS) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            {/* Join Cohort Form */}
            <Card className="border border-border-custom bg-surface shadow-md flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-soil flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-clay" />
                  Join Squad
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-0">
                <p className="text-xs text-muted leading-relaxed text-left">
                  Enter an invite code provided by a friend or colleague to join their cooperative carbon reduction squad.
                </p>
                <form onSubmit={handleJoin} className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] font-bold text-muted uppercase">
                      6-Digit Invite Code
                    </label>
                    <Input
                      placeholder="e.g. AX3P1Y"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="font-mono text-center font-bold tracking-widest text-lg"
                    />
                  </div>
                  <Button
                    type="submit"
                    isLoading={joinMutation.isPending}
                    className="w-full font-bold bg-clay border-clay"
                  >
                    JOIN SQUAD
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Create Cohort Form */}
            <Card className="border border-border-custom bg-surface shadow-md">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-soil flex items-center gap-2">
                  <Plus className="h-5 w-5 text-moss" />
                  Create Squad
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-0">
                <p className="text-xs text-muted leading-relaxed text-left">
                  Start a new cooperative cohort and invite others. An active woodland restoration quest will be automatically seeded.
                </p>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted uppercase">
                      Squad Name
                    </label>
                    <Input
                      placeholder="e.g. Earth Savers Office"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-muted uppercase">
                      Squad Type
                    </label>
                    <select
                      value={createType}
                      onChange={(e: any) => setCreateType(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-custom-btn border border-border-custom bg-background focus:outline-none focus:ring-1 focus:ring-clay/50 text-soil font-sans"
                    >
                      <option value="friends_family">Friends & Family</option>
                      <option value="neighbors">Neighborhood</option>
                      <option value="workplace">Workplace</option>
                      <option value="interest">Interest Group</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    isLoading={createMutation.isPending}
                    className="w-full font-bold bg-moss border-moss"
                  >
                    CREATE SQUAD
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageShell>
  );
}
