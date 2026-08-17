import { describe, it, expect } from "vitest";
import { Money } from "../src/server/utils/money";

describe("Money Utility Unit Tests", () => {
  it("should accurately convert floats to minor units (cents)", () => {
    expect(Money.toMinor(47000.5)).toBe(4700050);
    expect(Money.toMinor(0.1 + 0.2)).toBe(30);
  });

  it("should accurately perform KES addition without floating point drift", () => {
    const sum = Money.add(47000.1, 1500.2);
    expect(sum).toBe(48500.3);
  });

  it("should accurately perform KES subtraction without floating point drift", () => {
    const remaining = Money.subtract(47000, 20000.33);
    expect(remaining).toBe(26999.67);
  });

  it("should format currency according to Kenyan Shilling standard", () => {
    const formatted = Money.format(47000);
    expect(formatted).toContain("47,000");
  });
});
