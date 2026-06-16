export interface OnboardingProfile {
  homeType: "apartment" | "house" | "shared";
  primaryTransport: "car" | "transit" | "bike" | "mix";
  dietType: "omnivore" | "flexitarian" | "vegetarian" | "vegan";
  flightFrequency: "0" | "1-3" | "4-8" | "9+";
  shoppingHabit: "minimal" | "average" | "frequent";
}

export interface CarbonSummary {
  period: "day" | "week" | "month" | "year";
  date: string;
  totalCo2eKg: number;
  previousPeriodCo2eKg: number;
  deltaPercent: number;
  accuracyScore: number;
  breakdown: {
    category: string;
    co2eKg: number;
    percent: number;
  }[];
  equivalences: {
    balloons: number;
    arcticIceSqft: number;
    treesWorkingYear: number;
    showerHours: number;
    milesDriven: number;
    beefBurgers: number;
  };
  trend: {
    date: string;
    co2eKg: number;
  }[];
  projectedAnnualCo2eKg: number;
}
