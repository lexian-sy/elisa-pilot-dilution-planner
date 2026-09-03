(function attachPlanner(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.ELISAPlanner = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createPlanner() {
  "use strict";

  const EPSILON = 1e-9;

  function isFiniteNumber(value) {
    return Number.isFinite(value);
  }

  function nearlyEqual(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
  }

  function validate(input) {
    const errors = [];
    const add = (field, code, message) => errors.push({ field, code, message });

    if (!isFiniteNumber(input.assayLower) || input.assayLower <= 0) {
      add("assayLower", "assay_lower_invalid", "Enter a usable-range lower bound greater than 0.");
    }
    if (!isFiniteNumber(input.assayUpper) || input.assayUpper <= 0) {
      add("assayUpper", "assay_upper_invalid", "Enter a usable-range upper bound greater than 0.");
    } else if (isFiniteNumber(input.assayLower) && input.assayUpper <= input.assayLower) {
      add("assayUpper", "assay_upper_order", "The upper bound must be greater than the lower bound.");
    }

    if (!isFiniteNumber(input.expectedUpper) || input.expectedUpper <= 0) {
      add("expectedUpper", "expected_upper_invalid", "Enter an expected upper concentration greater than 0.");
    }
    if (!input.lowerUnknown) {
      if (!isFiniteNumber(input.expectedLower) || input.expectedLower <= 0) {
        add("expectedLower", "expected_lower_invalid", "Enter an expected lower concentration greater than 0.");
      } else if (
        isFiniteNumber(input.expectedUpper) &&
        input.expectedUpper < input.expectedLower
      ) {
        add("expectedUpper", "expected_upper_order", "The expected upper concentration cannot be below the lower concentration.");
      }
    }

    if (!Number.isInteger(input.points) || input.points < 1 || input.points > 12) {
      add("points", "points_invalid", "Pilot points must be a whole number from 1 to 12.");
    }
    if (!isFiniteNumber(input.sampleVolume) || input.sampleVolume <= 0) {
      add("sampleVolume", "sample_volume_invalid", "Enter a sample volume per well greater than 0.");
    }
    if (!Number.isInteger(input.replicates) || input.replicates < 1 || input.replicates > 12) {
      add("replicates", "replicates_invalid", "Replicates must be a whole number from 1 to 12.");
    }
    if (!isFiniteNumber(input.overage) || input.overage < 0 || input.overage > 500) {
      add("overage", "overage_invalid", "Overage must be between 0% and 500%.");
    }
    if (!isFiniteNumber(input.minimumPipette) || input.minimumPipette <= 0) {
      add("minimumPipette", "minimum_pipette_invalid", "Enter a reliable pipetting volume greater than 0.");
    }

    if (!input.unit || input.unit.trim().length === 0) {
      add("unit", "unit_required", "Enter the concentration unit used for both ranges.");
    } else if (input.unit.trim().length > 30) {
      add("unit", "unit_too_long", "Keep the unit label to 30 characters or fewer.");
    }

    if (!['auto', 'fixed'].includes(input.mode)) {
      add("mode", "mode_invalid", "Choose Auto coverage or Fixed-fold mode.");
    }
    if (input.mode === "fixed") {
      if (!isFiniteNumber(input.startFactor) || input.startFactor < 1) {
        add("startFactor", "start_factor_invalid", "The starting dilution factor must be at least 1.");
      }
      if (!isFiniteNumber(input.fold) || input.fold <= 1) {
        add("fold", "fold_invalid", "The fold step must be greater than 1.");
      }
    }

    return errors;
  }

  function expectedLowerFor(input) {
    return input.lowerUnknown ? input.assayLower : input.expectedLower;
  }

  function centeredEndpoints(input) {
    const expectedLower = expectedLowerFor(input);
    const center = Math.exp((Math.log(input.assayLower) + Math.log(input.assayUpper)) / 2);
    const start = Math.max(1, expectedLower / center);
    const end = Math.max(start, input.expectedUpper / center);
    return { center, start, end };
  }

  function generateAutoFactors(input) {
    const { start, end } = centeredEndpoints(input);
    if (input.points === 1) {
      return [Math.sqrt(start * end)];
    }
    const ratio = Math.pow(end / start, 1 / (input.points - 1));
    return Array.from({ length: input.points }, (_, index) => start * Math.pow(ratio, index));
  }

  function generateFixedFactors(input) {
    return Array.from(
      { length: input.points },
      (_, index) => input.startFactor * Math.pow(input.fold, index),
    );
  }

  function bandForFactor(input, factor) {
    return {
      factor,
      lower: input.assayLower * factor,
      upper: input.assayUpper * factor,
    };
  }

  function mergeIntervals(intervals) {
    if (intervals.length === 0) return [];
    const sorted = intervals
      .map((interval) => ({ ...interval }))
      .sort((a, b) => a.lower - b.lower || a.upper - b.upper);
    const merged = [sorted[0]];

    for (const interval of sorted.slice(1)) {
      const tail = merged[merged.length - 1];
      const tolerance = EPSILON * Math.max(1, Math.abs(tail.upper), Math.abs(interval.lower));
      if (interval.lower <= tail.upper + tolerance) {
        tail.upper = Math.max(tail.upper, interval.upper);
      } else {
        merged.push(interval);
      }
    }
    return merged;
  }

  function analyzeCoverage(input, factors) {
    const targetLower = expectedLowerFor(input);
    const targetUpper = input.expectedUpper;
    const bands = factors.map((factor) => bandForFactor(input, factor));
    const clipped = bands
      .map((band) => ({
        lower: Math.max(targetLower, band.lower),
        upper: Math.min(targetUpper, band.upper),
      }))
      .filter((interval) => interval.upper >= interval.lower && interval.upper > 0);
    const merged = mergeIntervals(clipped);
    const gaps = [];

    if (nearlyEqual(targetLower, targetUpper)) {
      const covered = merged.some(
        (interval) => interval.lower <= targetLower && interval.upper >= targetUpper,
      );
      if (!covered) gaps.push({ lower: targetLower, upper: targetUpper });
      return {
        targetLower,
        targetUpper,
        bands,
        merged,
        gaps,
        full: covered,
        coveragePercent: covered ? 100 : 0,
      };
    }

    let cursor = targetLower;
    for (const interval of merged) {
      if (interval.lower > cursor && !nearlyEqual(interval.lower, cursor)) {
        gaps.push({ lower: cursor, upper: interval.lower });
      }
      cursor = Math.max(cursor, interval.upper);
    }
    if (cursor < targetUpper && !nearlyEqual(cursor, targetUpper)) {
      gaps.push({ lower: cursor, upper: targetUpper });
    }

    const denominator = Math.log(targetUpper / targetLower);
    const coveredLogSpan = merged.reduce((sum, interval) => {
      if (interval.upper <= interval.lower) return sum;
      return sum + Math.log(interval.upper / interval.lower);
    }, 0);
    const coveragePercent = denominator > 0
      ? Math.max(0, Math.min(100, (coveredLogSpan / denominator) * 100))
      : 0;

    return {
      targetLower,
      targetUpper,
      bands,
      merged,
      gaps,
      full: gaps.length === 0,
      coveragePercent,
    };
  }

  function minimumPointCount(input) {
    if (input.expectedUpper < input.assayLower) return null;
    if (!input.lowerUnknown && input.expectedLower < input.assayLower) return null;
    const { start, end } = centeredEndpoints(input);
    if (end <= start || nearlyEqual(end, start)) return 1;
    const assaySpan = input.assayUpper / input.assayLower;
    return Math.ceil(Math.log(end / start) / Math.log(assaySpan) - EPSILON) + 1;
  }

  function nearestNiceFactor(value) {
    if (value <= 1) return 1;
    const exponent = Math.floor(Math.log10(value));
    const candidates = [];
    for (let power = exponent - 1; power <= exponent + 1; power += 1) {
      for (const multiplier of [1, 2, 5]) {
        const candidate = multiplier * Math.pow(10, power);
        if (candidate >= 1) candidates.push(candidate);
      }
    }
    return candidates.reduce((best, candidate) => {
      const bestDistance = Math.abs(Math.log(best / value));
      const candidateDistance = Math.abs(Math.log(candidate / value));
      return candidateDistance < bestDistance ? candidate : best;
    });
  }

  function roundedFactorsIfSafe(input, rawFactors, rawCoverage) {
    if (!rawCoverage.full) return null;
    const rounded = rawFactors.map(nearestNiceFactor);
    const unique = new Set(rounded.map((value) => String(value)));
    if (unique.size !== rawFactors.length) return null;
    for (let index = 1; index < rounded.length; index += 1) {
      if (rounded[index] <= rounded[index - 1]) return null;
    }
    const roundedCoverage = analyzeCoverage(input, rounded);
    if (!roundedCoverage.full) return null;
    if (rounded.every((value, index) => nearlyEqual(value, rawFactors[index]))) return null;
    return rounded;
  }

  function liquidPlan(input, factors) {
    const preparedPerPoint = input.sampleVolume * input.replicates * (1 + input.overage / 100);
    const rows = factors.map((factor) => {
      const originalSample = preparedPerPoint / factor;
      return {
        factor,
        coverage: bandForFactor(input, factor),
        preparedVolume: preparedPerPoint,
        originalSample,
        diluent: preparedPerPoint - originalSample,
        directPreparationReliable: originalSample + EPSILON >= input.minimumPipette,
      };
    });
    return {
      rows,
      wells: factors.length * input.replicates,
      preparedTotal: preparedPerPoint * factors.length,
      originalSampleTotal: rows.reduce((sum, row) => sum + row.originalSample, 0),
      warningCount: rows.filter((row) => !row.directPreparationReliable).length,
    };
  }

  function evaluateFactorSet(input, factors) {
    return {
      factors,
      coverage: analyzeCoverage(input, factors),
      liquid: liquidPlan(input, factors),
    };
  }

  function calculate(input) {
    const errors = validate(input);
    if (errors.length > 0) {
      return { ok: false, errors };
    }

    if (input.expectedUpper < input.assayLower) {
      return {
        ok: true,
        status: "impossible",
        reason: "Dilution cannot bring an expected concentration upward into the usable assay range.",
        expectedLower: expectedLowerFor(input),
        minimumPoints: null,
      };
    }

    const rawFactors = input.mode === "auto"
      ? generateAutoFactors(input)
      : generateFixedFactors(input);
    if (rawFactors.some((factor) => !Number.isFinite(factor) || factor < 1)) {
      return {
        ok: false,
        errors: [{
          field: input.mode === "fixed" ? "fold" : "expectedUpper",
          code: "numeric_range",
          message: "These values produce dilution factors outside the calculator's numeric range.",
        }],
      };
    }
    const raw = evaluateFactorSet(input, rawFactors);
    const roundedFactors = input.mode === "auto"
      ? roundedFactorsIfSafe(input, rawFactors, raw.coverage)
      : null;
    const rounded = roundedFactors ? evaluateFactorSet(input, roundedFactors) : null;

    return {
      ok: true,
      status: raw.coverage.full ? "covered" : "gaps",
      expectedLower: expectedLowerFor(input),
      minimumPoints: minimumPointCount(input),
      raw,
      rounded,
      lowerUnknown: input.lowerUnknown,
      unreachableLow: !input.lowerUnknown && input.expectedLower < input.assayLower,
    };
  }

  return {
    analyzeCoverage,
    calculate,
    nearestNiceFactor,
    validate,
  };
});
