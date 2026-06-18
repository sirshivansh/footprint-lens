"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@/components/ui";
import { trpc } from "@/lib/trpc/client";
import { useUIStore } from "@/stores/ui-store";
import { UserPlus, ArrowLeft, ShieldCheck } from "lucide-react";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToast = useUIStore((s) => s.addToast);
  const joinMutation = trpc.cohorts.join.useMutation();

  const [inviteCode, setInviteCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setInviteCode(code.toUpperCase());
    }
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!inviteCode.trim() || inviteCode.trim().length !== 6) {
      setErrorMsg("Please enter a valid 6-character code.");
      return;
    }

    try {
      await joinMutation.mutateAsync({
        inviteCode: inviteCode.trim().toUpperCase(),
      });
      addToast({
        type: "success",
        title: "Joined Squad",
        description: "You have successfully joined the carbon cohort!",
      });
      router.push("/cohort");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to join cohort. Please check the code and try again.");
    }
  };

  return (
    <Card className="border border-border-custom bg-surface shadow-md">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-soil flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-clay" />
          Join Cohort
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-0">
        <p className="text-sm text-muted leading-relaxed text-left font-sans">
          You are about to join a cooperative carbon cohort. You'll swap carbon habits anonymously with others to complete collective environmental quests.
        </p>

        {errorMsg && (
          <div className="rounded-custom-btn border border-ember/20 bg-ember/5 p-3 text-xs text-ember font-semibold text-left">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-muted uppercase font-sans">
              6-Digit Invite Code
            </label>
            <Input
              placeholder="e.g. AX3P1Y"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="font-mono text-center font-bold tracking-widest text-xl h-12"
            />
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-soil/3 border border-border-custom rounded-custom-btn text-left">
            <ShieldCheck className="h-5 w-5 text-moss shrink-0" />
            <span className="text-xs text-muted leading-relaxed font-sans">
              <strong>Privacy protected:</strong> Cohorts are anonymous. No one in the squad can see your name, email, or individual transactions.
            </span>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/cohort")}
              className="flex-1 font-bold text-soil h-11 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK
            </Button>
            <Button
              type="submit"
              isLoading={joinMutation.isPending}
              className="flex-[2] font-bold bg-clay border-clay h-11"
            >
              JOIN SQUAD
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CohortJoinPage() {
  return (
    <PageShell maxWidth="sm">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="h-8 w-8 rounded-full border-2 border-clay/20 border-t-clay animate-spin" />
        </div>
      }>
        <JoinForm />
      </Suspense>
    </PageShell>
  );
}
