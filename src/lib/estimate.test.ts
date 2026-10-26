import { describe, expect, it } from "vitest";
import {
  calculateEstimate,
  featureGroups,
  pricing,
  type ProjectType,
} from "@/lib/estimate";

describe("project estimator", () => {
  it("returns an ordered ZAR planning range for every category", () => {
    const types = Object.keys(pricing.categories) as ProjectType[];
    for (const type of types) {
      const estimate = calculateEstimate({
        type,
        features: [],
        complexity: "basic",
        design: "adapted",
        urgency: "flexible",
      });
      expect(estimate.min).toBeGreaterThan(0);
      expect(estimate.max).toBeGreaterThanOrEqual(estimate.min);
    }
  });

  it("adds the selected feature range and counts duplicates once", () => {
    const base = calculateEstimate({
      type: "website",
      features: [],
      complexity: "basic",
      design: "adapted",
      urgency: "flexible",
    });
    const withFeature = calculateEstimate({
      type: "website",
      features: ["contact", "contact"],
      complexity: "basic",
      design: "adapted",
      urgency: "flexible",
    });
    expect(
      Math.abs(withFeature.min - base.min - pricing.features.contact.min),
    ).toBeLessThanOrEqual(250);
    expect(
      Math.abs(withFeature.max - base.max - pricing.features.contact.max),
    ).toBeLessThanOrEqual(250);
    expect(withFeature.featureKeys).toEqual(["contact"]);
  });

  it("applies complexity, design and urgency adjustments", () => {
    const standard = calculateEstimate({
      type: "website",
      features: [],
      complexity: "standard",
      design: "custom",
      urgency: "flexible",
    });
    const rush = calculateEstimate({
      type: "website",
      features: [],
      complexity: "standard",
      design: "custom",
      urgency: "rush",
    });
    expect(rush.min).toBeGreaterThan(standard.min);
    expect(rush.max).toBeGreaterThan(standard.max);
  });

  it("offers only configured features for each project type", () => {
    for (const type of Object.keys(featureGroups) as ProjectType[]) {
      expect(featureGroups[type].every((key) => key in pricing.features)).toBe(
        true,
      );
      expect(new Set(featureGroups[type]).size).toBe(
        featureGroups[type].length,
      );
    }
  });
});
