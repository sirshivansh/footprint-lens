"use client";

import { create } from "zustand";
import type { OnboardingProfile } from "@/types/carbon";

interface OnboardingState {
  // Current step (0-indexed: welcome=0, profile=1, accuracy=2, lens-preview=3)
  step: number;

  // 5-Tap Profile selections
  profile: Partial<OnboardingProfile>;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProfileField: <K extends keyof OnboardingProfile>(
    key: K,
    value: OnboardingProfile[K]
  ) => void;
  reset: () => void;

  // Computed
  isProfileComplete: () => boolean;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step: 0,
  profile: {},

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),

  setProfileField: (key, value) =>
    set((state) => ({
      profile: { ...state.profile, [key]: value },
    })),

  reset: () => set({ step: 0, profile: {} }),

  isProfileComplete: () => {
    const p = get().profile;
    return !!(
      p.homeType &&
      p.primaryTransport &&
      p.dietType &&
      p.flightFrequency &&
      p.shoppingHabit
    );
  },
}));
