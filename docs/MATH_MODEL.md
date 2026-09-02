# Math and product boundary

## Inputs

- User-defined usable assay interval: `L–U`, with `0 < L < U`.
- Expected original target-analyte interval: `A–B`; when only an upper bound is known, v0 uses `A = L` as a planning start and labels the uncertainty.
- Pilot point count `N`.
- Sample volume per well, replicate count, overage, and minimum reliable pipetting volume.

All concentration inputs use one user-entered unit. The algorithm does not infer or convert analytes or concentration units.

## Coverage identity

For dilution factor `d`, the assay interval maps to an original-sample coverage band:

```text
[L × d, U × d]
```

The result union is clipped to the expected interval and checked for gaps. Adjacent bands can be gap-free only when their factor ratio is no greater than `U / L`.

## Auto Centered Coverage

The engineering center of the usable interval is its geometric midpoint:

```text
G = sqrt(L × U)
d_start = max(1, A / G)
d_end = max(d_start, B / G)
```

For `N > 1`, factors are evenly spaced on a log scale from `d_start` to `d_end`. For `N = 1`, the factor is the geometric midpoint of those endpoints. The generated bands are always re-evaluated; the UI never labels a gapped set as full coverage.

The mathematical minimum point count for this centered span is:

```text
ceil(log(d_end / d_start) / log(U / L)) + 1
```

with one point sufficient when the endpoint ratio is effectively 1.

## Bench-friendly factors

Raw auto factors may be rounded to the nearest `1 / 2 / 5 × 10^n` value only when:

1. the rounded set keeps the same number of distinct, increasing points; and
2. a fresh coverage-union check still covers the complete entered expected range without gaps.

Raw factors remain the calculation source. No simplified set appears when the raw plan is already incomplete.

## Fixed-fold mode

The user supplies a starting factor `s` and fold `f > 1`:

```text
d_i = s × f^i
```

The tool evaluates coverage, gaps, wells, sample use, and pipetting warnings. It does not call the series optimal or recommended.

## Direct preparation

For each dilution point:

```text
Vprep = sample_volume_per_well × replicates × (1 + overage / 100)
Vsample = Vprep / d
Vdiluent = Vprep - Vsample
```

When `Vsample` is below the user's minimum reliable pipetting volume, v0 reports `Intermediate dilution required`. It does not create a staged protocol because that requires additional lab-specific decisions.

## Claims the tool must not make

The model does not validate matrix effects, dilutional linearity, recovery, hook effect, assay performance, analyte suitability, clinical interpretation, or compliance with a kit or lab method. Kit inserts and validated methods override the planner whenever they specify handling or dilution.
