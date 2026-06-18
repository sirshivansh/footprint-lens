"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button, Card } from "@/components/ui";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const { setStep } = useOnboardingStore();
  const mutation = trpc.profile.saveOnboarding.useMutation();

  useEffect(() => {
    setStep(0);
  }, [setStep]);

  const handleTryDemo = async () => {
    try {
      console.log("[DEMO] Seeding demo profile preferences...");
      await mutation.mutateAsync({
        homeType: "apartment",
        primaryTransport: "transit",
        dietType: "vegetarian", // Veg by default
        flightFrequency: "1-3",
        shoppingHabit: "average",
      });
      // Redirect straight to main dashboard
      router.push("/");
    } catch (error) {
      console.error("[DEMO] Failed to generate demo profile:", error);
    }
  };

  return (
    <OnboardingStep
      step={1}
      totalSteps={4}
      onSkip={() => router.push("/")}
      skipLabel="Skip onboarding"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="p-8 border-border-custom bg-surface text-center flex flex-col gap-8 shadow-md">
          {/* Illustration Emoji */}
          <div className="text-6xl select-none animate-bounce duration-[2000ms]">🌍</div>

          {/* Text content */}
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-soil leading-tight">
              See your impact.<br />
              Shrink it.<br />
              Prove it.
            </h1>
            <p className="text-base text-muted max-w-sm mx-auto font-sans leading-relaxed">
              A personal carbon intelligence companion that works with your life, not against it. Understand your footprint and take simple swaps.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={() => router.push("/profile-setup")}
              disabled={mutation.isPending}
              className="w-full text-base font-bold tracking-wide"
            >
              GET STARTED →
            </Button>

            <Button
              size="lg"
              variant="accent"
              onClick={handleTryDemo}
              isLoading={mutation.isPending}
              disabled={mutation.isPending}
              className="w-full text-base font-bold tracking-wide"
            >
              TRY DEMO (INSTANT PREVIEW) 🚀
            </Button>

            <span className="text-xs text-muted font-sans font-semibold">
              No account registration required to start.
            </span>
          </div>
        </Card>
      </motion.div>
    </OnboardingStep>
  );
}
