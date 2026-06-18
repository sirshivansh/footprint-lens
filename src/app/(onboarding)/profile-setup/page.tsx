"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { CardSwipe, OnboardingData } from "@/components/onboarding/card-swipe";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Skeleton } from "@/components/ui";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { setStep } = useOnboardingStore();
  const mutation = trpc.profile.saveOnboarding.useMutation();

  useEffect(() => {
    setStep(1);
  }, [setStep]);

  const handleComplete = async (data: OnboardingData) => {
    try {
      console.log("[ONBOARDING] Submitting profile data...", data);
      const result = await mutation.mutateAsync(data);
      
      // Store results in sessionStorage to transfer to next screen
      sessionStorage.setItem("estimatedAnnualCo2eKg", result.estimatedAnnualCo2eKg.toString());
      sessionStorage.setItem("profileBreakdown", JSON.stringify(result.breakdown));
      
      // Redirect to accuracy screen
      router.push("/accuracy");
    } catch (error) {
      console.error("[ONBOARDING] Failed to save profile:", error);
    }
  };

  if (mutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
        <Skeleton className="h-96 w-full max-w-md rounded-2xl animate-pulse" />
        <div className="flex flex-col gap-2">
          <span className="font-serif text-xl font-bold text-soil animate-pulse">
            Analyzing your carbon pulse...
          </span>
          <span className="text-sm text-muted">
            Calculating estimates and generating transaction database
          </span>
        </div>
      </div>
    );
  }

  return (
    <OnboardingStep
      step={2}
      totalSteps={4}
      showBack={true}
      onBack={() => router.push("/welcome")}
      onSkip={() => router.push("/")}
    >
      <div className="py-2">
        <CardSwipe onComplete={handleComplete} />
      </div>
    </OnboardingStep>
  );
}
