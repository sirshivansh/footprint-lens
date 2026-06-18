// ─── App-Wide Constants ───

// Cohort limits
export const MAX_COHORT_MEMBERS = 12;
export const MIN_COHORT_MEMBERS = 4;

// Action engine thresholds
export const TIER_1_UNLOCK_THRESHOLD = 0; // Always unlocked
export const TIER_2_UNLOCK_THRESHOLD = 5; // Complete 5 Tier 1 actions
export const TIER_3_UNLOCK_THRESHOLD = 5; // Complete 5 Tier 2 actions (after Tier 2 unlocked)
export const ACTION_RETIRE_DISMISSALS = 3; // Retire after 3 dismissals

// Forest milestones
export const TREE_CO2E_KG = 100; // Each tree = 100 kg CO₂ reduced
export const WILDLIFE_MILESTONES = {
  fox: 1000, // Fox at 1 ton
  deer: 5000, // Deer at 5 tons
  eagle: 10000, // Eagle at 10 tons
} as const;

// Accuracy scoring
export const BASE_ACCURACY_SCORE = 55;
export const BANK_CONNECTED_ACCURACY = 78;
export const FULL_DATA_ACCURACY = 95;

// Subscription
export const PREMIUM_PRICE_MONTHLY = 4.99;
export const IMPACT_FUND_PERCENT = 10;

// Performance budgets
export const RECEIPT_OCR_TIMEOUT_MS = 3000;
export const API_READ_TIMEOUT_MS = 200;
export const API_WRITE_TIMEOUT_MS = 500;

// Animation durations (ms)
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 600,
  countUp: 800,
  staggerDelay: 50,
} as const;

// Easing curves
export const EASING = {
  easeOutExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 400, damping: 25 },
  springBouncy: { type: "spring" as const, stiffness: 500, damping: 15 },
} as const;

// Breakpoints (must match Tailwind)
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 641,
  desktop: 1025,
} as const;

// Equivalence icons (emoji mapped to types from equivalence engine)
export const EQUIVALENCE_ICONS: Record<string, string> = {
  balloons: "🎈",
  arctic_ice: "🧊",
  trees: "🌳",
  shower_hours: "🚿",
  miles_driven: "🚗",
  cheese_blocks: "🧀",
} as const;

// Carbon categories
export const CARBON_CATEGORIES = ["transport", "diet", "energy", "shopping", "other"] as const;
export type CarbonCategory = (typeof CARBON_CATEGORIES)[number];

// Nav items
export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Lens", href: "/lens", icon: "Search" },
  { label: "Actions", href: "/actions", icon: "Compass" },
  { label: "Cohort", href: "/cohort", icon: "Users" },
  { label: "Impact", href: "/impact", icon: "Globe" },
] as const;
