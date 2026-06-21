import { describe, it, expect } from "vitest";
import {
  formatCO2,
  formatNumber,
  formatDelta,
  formatCurrency,
  formatDate,
  formatMonthYear,
  formatRelativeTime,
  truncate,
} from "@/lib/format";

describe("formatCO2", () => {
  it("should return kg for values under 1000", () => {
    const result = formatCO2(500);
    expect(result.unit).toBe("kg CO₂e");
    expect(result.raw).toBe(500);
  });

  it("should return tons for values at exactly 1000", () => {
    const result = formatCO2(1000);
    expect(result.unit).toBe("tons CO₂e");
    expect(result.value).toBe("1.00");
    expect(result.raw).toBe(1);
  });

  it("should return tons for values above 1000", () => {
    const result = formatCO2(2500);
    expect(result.unit).toBe("tons CO₂e");
    expect(result.value).toBe("2.50");
    expect(result.raw).toBe(2.5);
  });

  it("should handle zero", () => {
    const result = formatCO2(0);
    expect(result.unit).toBe("kg CO₂e");
    expect(result.raw).toBe(0);
  });

  it("should handle small decimal values", () => {
    const result = formatCO2(0.5);
    expect(result.unit).toBe("kg CO₂e");
    expect(result.raw).toBe(0.5);
  });

  it("should handle large values correctly", () => {
    const result = formatCO2(15000);
    expect(result.unit).toBe("tons CO₂e");
    expect(result.value).toBe("15.00");
  });
});

describe("formatNumber", () => {
  it("should format with no decimals by default", () => {
    const result = formatNumber(1234);
    expect(result).toBe("1,234");
  });

  it("should format with specified decimals", () => {
    const result = formatNumber(1234.567, 2);
    expect(result).toBe("1,234.57");
  });

  it("should handle zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("should handle negative numbers", () => {
    const result = formatNumber(-500);
    expect(result).toBe("-500");
  });
});

describe("formatDelta", () => {
  it("should show down arrow for negative percent", () => {
    const result = formatDelta(-28);
    expect(result.direction).toBe("down");
    expect(result.text).toBe("↓ 28%");
  });

  it("should show up arrow for positive percent", () => {
    const result = formatDelta(12);
    expect(result.direction).toBe("up");
    expect(result.text).toBe("↑ 12%");
  });

  it("should show flat for near-zero values", () => {
    const result = formatDelta(0.3);
    expect(result.direction).toBe("flat");
    expect(result.text).toBe("No change");
  });

  it("should show flat for exactly zero", () => {
    const result = formatDelta(0);
    expect(result.direction).toBe("flat");
  });

  it("should show flat for small negative values", () => {
    const result = formatDelta(-0.4);
    expect(result.direction).toBe("flat");
  });

  it("should handle boundary at 0.5", () => {
    const result = formatDelta(0.5);
    expect(result.direction).toBe("up");
  });

  it("should handle boundary at -0.5", () => {
    const result = formatDelta(-0.5);
    expect(result.direction).toBe("down");
  });
});

describe("formatCurrency", () => {
  it("should format USD by default", () => {
    const result = formatCurrency(45);
    expect(result).toBe("$45.00");
  });

  it("should handle decimal amounts", () => {
    const result = formatCurrency(12.5);
    expect(result).toBe("$12.50");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0);
    expect(result).toBe("$0.00");
  });

  it("should handle large amounts with commas", () => {
    const result = formatCurrency(1234.56);
    expect(result).toBe("$1,234.56");
  });
});

describe("formatDate", () => {
  it("should format a date string without year", () => {
    const result = formatDate("2026-06-15");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
  });

  it("should format a date string with year", () => {
    const result = formatDate("2026-06-15", { includeYear: true });
    expect(result).toContain("2026");
  });

  it("should accept a Date object", () => {
    const result = formatDate(new Date(2026, 0, 1));
    expect(result).toContain("Jan");
    expect(result).toContain("1");
  });
});

describe("formatMonthYear", () => {
  it("should format as full month and year", () => {
    const result = formatMonthYear("2026-06-15");
    expect(result).toBe("June 2026");
  });

  it("should accept a Date object", () => {
    const result = formatMonthYear(new Date(2026, 11, 25));
    expect(result).toBe("December 2026");
  });
});

describe("truncate", () => {
  it("should not truncate short strings", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("should truncate long strings with ellipsis", () => {
    const result = truncate("This is a long string", 10);
    expect(result).toBe("This is a…");
    expect(result.length).toBe(10);
  });

  it("should handle string exactly at max length", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });

  it("should handle empty string", () => {
    expect(truncate("", 5)).toBe("");
  });
});
