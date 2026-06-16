import { describe, it, expect } from "vitest";
import { calculateProfileEstimate, getDateRange } from "@/server/services/carbon-engine";
import { getEquivalences, getPrimaryEquivalence } from "@/server/services/equivalence-engine";
import { OnboardingProfile } from "@/types/carbon";

describe("Equivalence Engine", () => {
  it("should calculate correct equivalents for a given carbon amount", () => {
    const co2eKg = 100; // 100 kg CO2e
    const equivs = getEquivalences(co2eKg);

    const balloons = equivs.find((e) => e.type === "balloons");
    const ice = equivs.find((e) => e.type === "arctic_ice");
    const trees = equivs.find((e) => e.type === "trees");
    const shower = equivs.find((e) => e.type === "shower_hours");
    const miles = equivs.find((e) => e.type === "miles_driven");
    const burgers = equivs.find((e) => e.type === "beef_burgers");

    expect(balloons?.value).toBe(Math.round(100 * 564.39));
    expect(ice?.value).toBe(Number((100 * 0.032).toFixed(2)));
    expect(trees?.value).toBe(Number((100 * 0.005).toFixed(2)));
    expect(shower?.value).toBe(Math.round(100 * 0.3));
    expect(miles?.value).toBe(Math.round(100 * 2.5));
    expect(burgers?.value).toBe(Math.round(100 * 0.0768));
  });

  it("should return a formatted primary equivalence string based on miles", () => {
    const co2eKg = 50;
    const primaryStr = getPrimaryEquivalence(co2eKg);
    expect(primaryStr).toBe("Driving 125 miles");
  });
});

describe("Carbon Engine - Profile Calculations", () => {
  it("should calculate correct total and category breakdown for a low-carbon profile", () => {
    const lowProfile: OnboardingProfile = {
      homeType: "apartment", // 2000
      primaryTransport: "bike", // 200
      dietType: "vegan", // 1000
      flightFrequency: "0", // 0
      shoppingHabit: "minimal", // 1000
    };

    const estimate = calculateProfileEstimate(lowProfile);
    
    // total = 2000 (energy) + (200 + 0) (transport) + 1000 (diet) + 1000 (shopping) + 500 (other base) = 4700 kg
    expect(estimate.total).toBe(4700);
    
    const energyItem = estimate.breakdown.find((b) => b.category === "energy");
    const transportItem = estimate.breakdown.find((b) => b.category === "transport");
    const dietItem = estimate.breakdown.find((b) => b.category === "diet");
    const shoppingItem = estimate.breakdown.find((b) => b.category === "shopping");
    const otherItem = estimate.breakdown.find((b) => b.category === "other");

    expect(energyItem?.co2eKg).toBe(2000);
    expect(transportItem?.co2eKg).toBe(200);
    expect(dietItem?.co2eKg).toBe(1000);
    expect(shoppingItem?.co2eKg).toBe(1000);
    expect(otherItem?.co2eKg).toBe(500);
  });

  it("should calculate correct total and category breakdown for a high-carbon profile", () => {
    const highProfile: OnboardingProfile = {
      homeType: "house", // 5000
      primaryTransport: "car", // 4000
      dietType: "omnivore", // 3000
      flightFrequency: "9+", // 10000
      shoppingHabit: "frequent", // 4000
    };

    const estimate = calculateProfileEstimate(highProfile);
    
    // total = 5000 (energy) + (4000 + 10000) (transport) + 3000 (diet) + 4000 (shopping) + 500 (other base) = 26500 kg
    expect(estimate.total).toBe(26500);
  });
});

describe("Carbon Engine - Date Ranges", () => {
  it("should calculate correct date boundaries for month period", () => {
    const testDate = "2026-06-15";
    const range = getDateRange("month", testDate);

    // Month start should be 2026-06-01
    expect(range.startDate.getFullYear()).toBe(2026);
    expect(range.startDate.getMonth()).toBe(5); // 0-indexed, so June is 5
    expect(range.startDate.getDate()).toBe(1);

    // Month end should be 2026-06-30
    expect(range.endDate.getFullYear()).toBe(2026);
    expect(range.endDate.getMonth()).toBe(5);
    expect(range.endDate.getDate()).toBe(30);
  });

  it("should calculate correct date boundaries for year period", () => {
    const testDate = "2026-06-15";
    const range = getDateRange("year", testDate);

    // Year start should be 2026-01-01
    expect(range.startDate.getFullYear()).toBe(2026);
    expect(range.startDate.getMonth()).toBe(0);
    expect(range.startDate.getDate()).toBe(1);

    // Year end should be 2026-12-31
    expect(range.endDate.getFullYear()).toBe(2026);
    expect(range.endDate.getMonth()).toBe(11);
    expect(range.endDate.getDate()).toBe(31);
  });
});
