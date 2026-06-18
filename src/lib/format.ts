// ─── Formatters for Numbers, Dates, and Carbon Values ───

/**
 * Format CO₂ value intelligently — tons for ≥1000 kg, kg otherwise.
 */
export function formatCO2(kg: number): { value: string; unit: string; raw: number } {
  if (kg >= 1000) {
    return {
      value: (kg / 1000).toFixed(2),
      unit: "tons CO₂e",
      raw: kg / 1000,
    };
  }
  return {
    value: Math.round(kg).toLocaleString(),
    unit: "kg CO₂e",
    raw: kg,
  };
}

/**
 * Format a number with commas (e.g. 1,204).
 */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a percentage with sign (e.g. "↓ 28%" or "↑ 12%").
 */
export function formatDelta(percent: number): { text: string; direction: "down" | "up" | "flat" } {
  if (Math.abs(percent) < 0.5) {
    return { text: "No change", direction: "flat" };
  }
  const direction = percent < 0 ? "down" : "up";
  const arrow = percent < 0 ? "↓" : "↑";
  return {
    text: `${arrow} ${Math.abs(percent).toFixed(0)}%`,
    direction,
  };
}

/**
 * Format currency (e.g. "$45.00").
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date as "Oct 15" or "Oct 15, 2026".
 */
export function formatDate(
  date: string | Date,
  options: { includeYear?: boolean } = {}
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(options.includeYear ? { year: "numeric" } : {}),
  });
}

/**
 * Format a date as "January 2026".
 */
export function formatMonthYear(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Relative time string (e.g. "2 hours ago", "Just now").
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return diffDays === 1 ? "Yesterday" : `${diffDays}d ago`;
  return formatDate(d);
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}
