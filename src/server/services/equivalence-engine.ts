// ─── Equivalence Engine Service ───

export interface EquivalenceDetail {
  type: string;
  value: number;
  unit?: string;
  label: string;
}

/**
 * Translates a given carbon footprint in kg CO2e into tangible physical metaphors.
 */
export function getEquivalences(co2eKg: number): EquivalenceDetail[] {
  // Conversions based on uiux.md specifications:
  // - 820 kg (0.82 tons) = 462,800 party balloons (1 kg = 564.39 balloons)
  // - 820 kg (0.82 tons) = 26.24 sq ft of Arctic sea ice (1 kg = 0.032 sq ft)
  // - 820 kg (0.82 tons) = 4.1 trees working all year (1 kg = 0.005 trees)
  // - 820 kg (0.82 tons) = 246 hours of hot shower (1 kg = 0.3 hours)
  // - 820 kg (0.82 tons) = 2050 miles driven (1 kg = 2.5 miles)
  // - 820 kg (0.82 tons) = 63 beef burgers (1 kg = 0.0768 burgers)

  const balloons = Math.round(co2eKg * 564.39);
  const arcticIce = Number((co2eKg * 0.032).toFixed(2));
  const trees = Number((co2eKg * 0.005).toFixed(2));
  const showerHours = Math.round(co2eKg * 0.3);
  const milesDriven = Math.round(co2eKg * 2.5);
  const beefBurgers = Math.round(co2eKg * 0.0768);

  return [
    {
      type: "balloons",
      value: balloons,
      label: `${balloons.toLocaleString()} party balloons`,
    },
    {
      type: "arctic_ice",
      value: arcticIce,
      unit: "sq ft",
      label: `${arcticIce.toLocaleString()} sq ft of Arctic ice`,
    },
    {
      type: "trees",
      value: trees,
      label: `${trees.toLocaleString()} trees working all year`,
    },
    {
      type: "shower_hours",
      value: showerHours,
      label: `${showerHours.toLocaleString()} hours of hot shower`,
    },
    {
      type: "miles_driven",
      value: milesDriven,
      label: `${milesDriven.toLocaleString()} miles driven`,
    },
    {
      type: "beef_burgers",
      value: beefBurgers,
      label: `${beefBurgers.toLocaleString()} beef burgers`,
    },
  ];
}

/**
 * Returns a single random or primary equivalence for quick card displays.
 */
export function getPrimaryEquivalence(co2eKg: number): string {
  const equivalences = getEquivalences(co2eKg);
  // Default to miles driven or trees
  const miles = equivalences.find((e) => e.type === "miles_driven");
  return miles ? `Driving ${miles.value.toLocaleString()} miles` : `${co2eKg.toFixed(1)} kg CO2e`;
}
