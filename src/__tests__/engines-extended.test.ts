import { describe, it, expect } from "vitest";
import { calculateProfileEstimate, getDateRange } from "@/server/services/carbon-engine";
import { getEquivalences, getPrimaryEquivalence } from "@/server/services/equivalence-engine";
import { OnboardingProfile } from "@/types/carbon";

// ─── Equivalence Engine ───

describe("Equivalence Engine - Edge Cases", () => {
  it("should handle zero emissions", () => {
    const equivs = getEquivalences(0);
    equivs.forEach((e) => {
      expect(e.value).toBe(0);
    });
  });

  it("should return 6 equivalence types", () => {
    const equivs = getEquivalences(100);
    expect(equivs).toHaveLength(6);
    const types = equivs.map((e) => e.type);
    expect(types).toContain("balloons");
    expect(types).toContain("arctic_ice");
    expect(types).toContain("trees");
    expect(types).toContain("shower_hours");
    expect(types).toContain("miles_driven");
    expect(types).toContain("cheese_blocks");
  });

  it("should scale linearly — doubling input doubles output", () => {
    const single = getEquivalences(100);
    const doubled = getEquivalences(200);
    const singleMiles = single.find((e) => e.type === "miles_driven")!.value;
    const doubledMiles = doubled.find((e) => e.type === "miles_driven")!.value;
    expect(doubledMiles).toBe(singleMiles * 2);
  });

  it("should return labels as non-empty strings", () => {
    const equivs = getEquivalences(50);
    equivs.forEach((e) => {
      expect(e.label).toBeTruthy();
      expect(typeof e.label).toBe("string");
      expect(e.label.length).toBeGreaterThan(0);
    });
  });

  it("should handle very large values without error", () => {
    const equivs = getEquivalences(100000);
    const balloons = equivs.find((e) => e.type === "balloons");
    expect(balloons!.value).toBe(Math.round(100000 * 564.39));
  });

  it("should handle decimal input values", () => {
    const equivs = getEquivalences(0.5);
    const miles = equivs.find((e) => e.type === "miles_driven");
    expect(miles!.value).toBe(Math.round(0.5 * 2.5));
  });
});

describe("getPrimaryEquivalence", () => {
  it("should return a miles-based string for positive values", () => {
    const result = getPrimaryEquivalence(100);
    expect(result).toBe("Driving 250 miles");
  });

  it("should return a miles-based string for zero", () => {
    const result = getPrimaryEquivalence(0);
    expect(result).toBe("Driving 0 miles");
  });

  it("should return string type", () => {
    expect(typeof getPrimaryEquivalence(50)).toBe("string");
  });
});

// ─── Carbon Engine - Profile Calculations ───

describe("Carbon Engine - Profile Estimate Edge Cases", () => {
  it("should handle a vegetarian flexible profile", () => {
    const profile: OnboardingProfile = {
      homeType: "shared",
      primaryTransport: "transit",
      dietType: "vegetarian",
      flightFrequency: "1-3",
      shoppingHabit: "average",
    };
    const estimate = calculateProfileEstimate(profile);
    // shared(1500) + transit(1000) + flights(1500) + veg(1500) + avg(2000) + other(500) = 8000
    expect(estimate.total).toBe(8000);
    expect(estimate.breakdown).toHaveLength(5);
  });

  it("should include all 5 categories in breakdown", () => {
    const profile: OnboardingProfile = {
      homeType: "apartment",
      primaryTransport: "car",
      dietType: "omnivore",
      flightFrequency: "0",
      shoppingHabit: "minimal",
    };
    const estimate = calculateProfileEstimate(profile);
    const categories = estimate.breakdown.map((b) => b.category);
    expect(categories).toContain("energy");
    expect(categories).toContain("transport");
    expect(categories).toContain("diet");
    expect(categories).toContain("shopping");
    expect(categories).toContain("other");
  });

  it("should always include 500 kg baseline for 'other' category", () => {
    const profile: OnboardingProfile = {
      homeType: "apartment",
      primaryTransport: "bike",
      dietType: "vegan",
      flightFrequency: "0",
      shoppingHabit: "minimal",
    };
    const estimate = calculateProfileEstimate(profile);
    const other = estimate.breakdown.find((b) => b.category === "other");
    expect(other?.co2eKg).toBe(500);
  });

  it("should calculate flexitarian diet correctly", () => {
    const profile: OnboardingProfile = {
      homeType: "apartment",
      primaryTransport: "bike",
      dietType: "flexitarian",
      flightFrequency: "0",
      shoppingHabit: "minimal",
    };
    const estimate = calculateProfileEstimate(profile);
    const diet = estimate.breakdown.find((b) => b.category === "diet");
    expect(diet?.co2eKg).toBe(2000);
  });

  it("should produce higher total for heavy vs light lifestyle", () => {
    const lightProfile: OnboardingProfile = {
      homeType: "shared",
      primaryTransport: "bike",
      dietType: "vegan",
      flightFrequency: "0",
      shoppingHabit: "minimal",
    };
    const heavyProfile: OnboardingProfile = {
      homeType: "house",
      primaryTransport: "car",
      dietType: "omnivore",
      flightFrequency: "9+",
      shoppingHabit: "frequent",
    };
    const light = calculateProfileEstimate(lightProfile);
    const heavy = calculateProfileEstimate(heavyProfile);
    expect(heavy.total).toBeGreaterThan(light.total);
  });

  it("breakdown should sum to total", () => {
    const profile: OnboardingProfile = {
      homeType: "house",
      primaryTransport: "mix",
      dietType: "flexitarian",
      flightFrequency: "4-8",
      shoppingHabit: "average",
    };
    const estimate = calculateProfileEstimate(profile);
    const sum = estimate.breakdown.reduce((acc, b) => acc + b.co2eKg, 0);
    expect(sum).toBe(estimate.total);
  });
});

// ─── Date Range Calculations ───

describe("Carbon Engine - Date Range Edge Cases", () => {
  it("should handle day period", () => {
    const range = getDateRange("day", "2026-06-15");
    expect(range.startDate.getHours()).toBe(0);
    expect(range.endDate.getHours()).toBe(23);
    expect(range.startDate.getDate()).toBe(range.endDate.getDate());
  });

  it("should handle week period starting on correct day", () => {
    const range = getDateRange("week", "2026-06-15");
    expect(range.startDate.getDay()).toBe(0); // Sunday
  });

  it("should handle month boundaries for February", () => {
    const range = getDateRange("month", "2026-02-15");
    expect(range.startDate.getDate()).toBe(1);
    expect(range.endDate.getDate()).toBe(28); // 2026 is not a leap year
  });

  it("should handle month boundaries for January (31 days)", () => {
    const range = getDateRange("month", "2026-01-15");
    expect(range.startDate.getDate()).toBe(1);
    expect(range.endDate.getDate()).toBe(31);
  });

  it("should handle year period correctly", () => {
    const range = getDateRange("year", "2026-06-15");
    expect(range.startDate.getMonth()).toBe(0);
    expect(range.startDate.getDate()).toBe(1);
    expect(range.endDate.getMonth()).toBe(11);
    expect(range.endDate.getDate()).toBe(31);
  });

  it("should default to current date when no date string provided", () => {
    const range = getDateRange("month");
    const now = new Date();
    expect(range.startDate.getMonth()).toBe(now.getMonth());
    expect(range.startDate.getFullYear()).toBe(now.getFullYear());
  });

  it("start date should always be before or equal to end date", () => {
    const periods: Array<"day" | "week" | "month" | "year"> = ["day", "week", "month", "year"];
    periods.forEach((period) => {
      const range = getDateRange(period, "2026-06-15");
      expect(range.startDate.getTime()).toBeLessThanOrEqual(range.endDate.getTime());
    });
  });
});
