# Current status

## Checkpoint

- Product: ELISA Pilot Dilution Planner
- Stage: local-only bilingual prototype v0.2 — English mobile results accepted; bilingual interaction QA remains
- Date: 2026-09-03
- Authority boundary: repair the owner-observed mobile chart collision, add English/Traditional Chinese localization, automated checks, a local Git checkpoint, and a self-contained QA artifact. No push, deployment, DNS, payment, account, or external commitment.

## Implemented

- Auto Centered Coverage with raw log-spaced factors.
- Gap union and minimum-point reporting.
- Safe `1 / 2 / 5 × 10^n` simplified factors only after a full coverage re-check.
- Fixed-fold evaluation mode.
- Direct-preparation sample/diluent math, well budget, and minimum-pipette warnings.
- Usable-range, expected-range, volume, replicate, point, and mode validation.
- Responsive, accessible, English-first local UI with explicit scientific boundaries.
- Complete in-page English/Traditional Chinese switch backed by one shared set of inputs, calculations, result state, and validation codes.
- Localized page metadata, static labels, dynamic results, warnings, validation errors, and accessibility labels.
- Mobile log-scale rows stack factor, track, and covered interval so long factor labels no longer share a narrow fixed column with the track.
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

- `npm run check`: passed.
- `node --test tests/*.test.js`: **26 passed, 0 failed**. This retains the 24 mathematical and boundary checks and adds locale-key parity, static/dynamic/error translation coverage, language-switch scaffolding, and the mobile stacked chart rule.
- `node --check src/planner.js`, `src/i18n.js`, and `src/app.js`: passed.
- Self-contained build passed. Output is 74,262 bytes with SHA-256 `7488da8cae698d90990b2565cb9ca162152f2fa36f05f86c85ded29687aa8471`.
- Static artifact checks passed: unique source IDs, all static app selectors resolved, 116 matching keys in both locales, no external dependency or network primitive, classic-script `file://` compatibility, required product/safety wording, viewport/accessibility scaffolding, and a local accessible language switch.
- Yao's v0.1 iPhone evidence confirmed the default calculation and exposed factor labels colliding with the chart track.
- Yao's 2026-09-03 v0.2 iPhone + Edge long screenshot accepted the English results section: the default calculation remains at 100% coverage, all four factors are correct, `396.8503×` and `7,905.6942×` are fully readable above their tracks, and no horizontal overflow or result-card clipping is visible through the footer.
- The EN ↔ 繁中 state-preservation pass, Chinese result layout, upper form, and short desktop validation have not yet received owner evidence.
- In the current iOS ChatGPT file-preview flow, the preview's **Download** command did not save reliably. **Share → Save to Files** succeeded; this is delivery friction outside the planner artifact.
- True browser automation remains unavailable in this Work runtime: the Playwright package exists, but no Chromium/Firefox/WebKit executable is installed. Desktop/mobile rendering and interaction remain an explicit owner-QA gate.

## Known limits

- No staged intermediate-dilution protocol generation.
- No unit conversion.
- No OD/curve fitting or assay-type input.
- No persistence, PWA, offline service worker, analytics, backend, or remote data.
- The local language selection resets to English on reload. Separate indexable `/` and `/zh-tw/` production paths and `hreflang` remain publication work.
- No public license or publication decision yet.

## Next safe step

Finish the focused EN ↔ 繁中 state-preservation/Chinese-layout pass and the short desktop validation pass. The long-factor mobile repair is accepted; publication remains a later authorized stage.
