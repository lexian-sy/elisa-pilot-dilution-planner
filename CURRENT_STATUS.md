# Current status

## Checkpoint

- Product: ELISA Pilot Dilution Planner
- Stage: local-only prototype v0.1
- Date: 2026-09-02
- Authority boundary: implementation, automated checks, local browser validation, local Git checkpoint, and a self-contained QA artifact. No push, deployment, DNS, payment, account, or external commitment.

## Implemented

- Auto Centered Coverage with raw log-spaced factors.
- Gap union and minimum-point reporting.
- Safe `1 / 2 / 5 × 10^n` simplified factors only after a full coverage re-check.
- Fixed-fold evaluation mode.
- Direct-preparation sample/diluent math, well budget, and minimum-pipette warnings.
- Usable-range, expected-range, volume, replicate, point, and mode validation.
- Responsive, accessible, English-first local UI with explicit scientific boundaries.
- Dependency-free self-contained HTML build.

## Required checks for this checkpoint

```sh
npm run check
```

Bounded browser smoke check (when the Work runtime supplies Playwright):

- Source page at `http://127.0.0.1:4173/`.
- Self-contained artifact from `file://.../dist/elisa-pilot-dilution-planner.html`.
- Desktop viewport and 390 × 844 mobile viewport.
- T1 result, simplified-factor switch, fixed-mode factor list, impossible-low-range stop, validation focus/linking, and horizontal-overflow check.
- Fail on unexpected network requests beyond the local source document.

## Evidence

- `node --test tests/*.test.js`: **24 passed, 0 failed**. This includes research cases T1–T8 plus fixed-fold generation, one-point centering, rounding safety, unreachable-low-range handling, and numeric overflow rejection.
- `node --check src/planner.js` and `node --check src/app.js`: passed.
- `node scripts/build-single-file.js`: passed. Output is 51,836 bytes with SHA-256 `1c725c44e010181a433fee17d87061f7f18a589f874fa657246aa26bc2e9956a`.
- Static artifact checks passed: unique source IDs, all static app selectors resolved, no external script/style dependency, no network primitive, classic-script `file://` compatibility, required product/safety wording, viewport/accessibility scaffolding, and 620 px responsive breakpoint.
- Local HTTP readback: `/` = 200 and `/src/planner.js` = 200 from an isolated `127.0.0.1:4173` server; server stopped after the check.
- True browser automation was not available in this Work runtime: the Playwright package exists, but no Chromium/Firefox/WebKit executable is installed. Desktop/mobile rendering and interaction therefore remain an explicit owner-QA gate rather than an inferred pass.

## Known limits

- No staged intermediate-dilution protocol generation.
- No unit conversion.
- No OD/curve fitting or assay-type input.
- No persistence, PWA, offline service worker, analytics, backend, or remote data.
- No public license or publication decision yet.

## Next safe step

After automated and bounded browser checks pass, create a recoverable local Git checkpoint, preserve the self-contained QA artifact, and hand `docs/YAO_QA.md` to Yao for iPhone and desktop owner QA.
