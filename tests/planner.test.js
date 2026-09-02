"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const planner = require("../src/planner.js");

function base(overrides = {}) {
  return {
    mode: "auto",
    assayLower: 1.6,
    assayUpper: 100,
    expectedLower: Number.NaN,
    expectedUpper: 100000,
    lowerUnknown: true,
    points: 4,
    sampleVolume: 50,
    replicates: 2,
    overage: 10,
    minimumPipette: 2,
    startFactor: 1,
    fold: 10,
    unit: "ng/mL",
    ...overrides,
  };
}

function close(actual, expected, tolerance = 1e-3) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);
}

test("T1: upper-bound-only IgG case gives four gap-free centered factors", () => {
  const result = planner.calculate(base());
  assert.equal(result.ok, true);
  assert.equal(result.status, "covered");
  assert.equal(result.minimumPoints, 4);
  const factors = result.raw.factors;
  close(factors[0], 1);
  close(factors[1], 19.9211);
  close(factors[2], 396.8503);
  close(factors[3], 7905.6942);
  assert.deepEqual(result.rounded.factors, [1, 20, 500, 10000]);
  assert.equal(result.rounded.coverage.full, true);
});

test("T2: 100–3000 usable and 1000–15000 expected works with two points", () => {
  const result = planner.calculate(base({
    assayLower: 100,
    assayUpper: 3000,
    expectedLower: 1000,
    expectedUpper: 15000,
    lowerUnknown: false,
    points: 2,
  }));
  close(result.raw.factors[0], 1.825742, 1e-5);
  close(result.raw.factors[1], 27.386128, 1e-5);
  assert.deepEqual(result.rounded.factors, [2, 20]);
  assert.equal(result.raw.coverage.full, true);
});

test("T3: expected concentrations entirely below the assay range stop cleanly", () => {
  const result = planner.calculate(base({
    assayLower: 10,
    assayUpper: 100,
    expectedLower: 1,
    expectedUpper: 5,
    lowerUnknown: false,
    points: 2,
  }));
  assert.equal(result.ok, true);
  assert.equal(result.status, "impossible");
  assert.match(result.reason, /cannot bring.*upward/i);
});

test("T4: a normal two-point case is continuously covered", () => {
  const result = planner.calculate(base({
    assayLower: 10,
    assayUpper: 100,
    expectedLower: 50,
    expectedUpper: 500,
    lowerUnknown: false,
    points: 2,
  }));
  close(result.raw.factors[0], 1.581139, 1e-5);
  close(result.raw.factors[1], 15.811388, 1e-5);
  assert.deepEqual(result.rounded.factors, [2, 20]);
  assert.equal(result.raw.coverage.full, true);
});

test("T5: three points expose gaps and report six as the minimum", () => {
  const result = planner.calculate(base({
    assayLower: 10,
    assayUpper: 100,
    expectedLower: 50,
    expectedUpper: 1000000,
    lowerUnknown: false,
    points: 3,
  }));
  assert.equal(result.status, "gaps");
  assert.equal(result.minimumPoints, 6);
  assert.equal(result.raw.coverage.gaps.length, 2);
  assert.equal(result.rounded, null);
});

test("T6: 1:10000 direct prep triggers an intermediate-dilution warning", () => {
  const result = planner.calculate(base({
    mode: "fixed",
    assayLower: 1,
    assayUpper: 10,
    expectedLower: 10000,
    expectedUpper: 10000,
    lowerUnknown: false,
    points: 1,
    startFactor: 10000,
  }));
  const row = result.raw.liquid.rows[0];
  close(row.preparedVolume, 110);
  close(row.originalSample, 0.011, 1e-9);
  assert.equal(row.directPreparationReliable, false);
});

test("T7: 1:20 direct prep clears a 2 µL minimum", () => {
  const result = planner.calculate(base({
    mode: "fixed",
    assayLower: 1,
    assayUpper: 10,
    expectedLower: 20,
    expectedUpper: 20,
    lowerUnknown: false,
    points: 1,
    startFactor: 20,
  }));
  const row = result.raw.liquid.rows[0];
  close(row.preparedVolume, 110);
  close(row.originalSample, 5.5);
  assert.equal(row.directPreparationReliable, true);
});

test("T8: invalid values never enter calculation output", async (t) => {
  const cases = [
    ["non-positive assay lower", { assayLower: 0 }],
    ["assay upper not above lower", { assayLower: 10, assayUpper: 10 }],
    ["expected upper below lower", { lowerUnknown: false, expectedLower: 100, expectedUpper: 10 }],
    ["points below one", { points: 0 }],
    ["non-positive sample volume", { sampleVolume: 0 }],
    ["non-positive replicates", { replicates: 0 }],
    ["non-positive minimum pipette", { minimumPipette: 0 }],
  ];
  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      const result = planner.calculate(base(overrides));
      assert.equal(result.ok, false);
      assert.ok(result.errors.length >= 1);
    });
  }
});

test("fixed-fold mode evaluates the user's own series", () => {
  const result = planner.calculate(base({
    mode: "fixed",
    assayLower: 10,
    assayUpper: 100,
    expectedLower: 10,
    expectedUpper: 10000,
    lowerUnknown: false,
    points: 4,
    startFactor: 1,
    fold: 10,
  }));
  assert.deepEqual(result.raw.factors, [1, 10, 100, 1000]);
  assert.equal(result.raw.coverage.full, true);
  assert.equal(result.rounded, null);
});

test("a single auto point is centered geometrically", () => {
  const result = planner.calculate(base({
    assayLower: 10,
    assayUpper: 100,
    expectedLower: 100,
    expectedUpper: 10000,
    lowerUnknown: false,
    points: 1,
  }));
  close(result.raw.factors[0], 31.622777, 1e-5);
  assert.equal(result.status, "gaps");
  assert.equal(result.minimumPoints, 3);
});

test("nice-factor rounding is never offered when it creates a coverage gap", () => {
  const input = base({
    assayLower: 10,
    assayUpper: 25,
    expectedLower: 15,
    expectedUpper: 300,
    lowerUnknown: false,
    points: 4,
  });
  const result = planner.calculate(input);
  if (result.rounded) {
    assert.equal(result.rounded.coverage.full, true);
  }
});

test("a known expected segment below the assay range is reported as unreachable", () => {
  const result = planner.calculate(base({
    assayLower: 10,
    assayUpper: 100,
    expectedLower: 5,
    expectedUpper: 500,
    lowerUnknown: false,
    points: 2,
  }));
  assert.equal(result.status, "gaps");
  assert.equal(result.unreachableLow, true);
  assert.equal(result.minimumPoints, null);
  assert.equal(result.raw.coverage.gaps[0].lower, 5);
  assert.equal(result.raw.coverage.gaps[0].upper, 10);
});

test("overflowing fixed-fold factors stop as a numeric-range error", () => {
  const result = planner.calculate(base({
    mode: "fixed",
    points: 12,
    startFactor: 1e300,
    fold: 1e300,
  }));
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].field, "fold");
});
