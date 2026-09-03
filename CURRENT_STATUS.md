# Current status

## Checkpoint

- Product: ELISA Pilot Dilution Planner
- Stage: bilingual local release candidate v0.3.1 — v0.3 iPhone functionality is accepted; mobile readability and upper-right language-switch feedback are implemented and await one focused iPhone UX check
- Date: 2026-09-03
- Authority boundary: prepare and verify a recoverable public-release candidate without push, deployment, DNS, payment/account changes, analytics, or external commitment.

## Implemented

- Auto Centered Coverage with raw log-spaced factors.
- Gap union and minimum-point reporting.
- Safe `1 / 2 / 5 × 10^n` simplified factors only after a full coverage re-check.
- Fixed-fold evaluation mode.
- Direct-preparation sample/diluent math, well budget, and minimum-pipette warnings.
- Usable-range, expected-range, volume, replicate, point, and mode validation.
- Responsive, accessible, English-first local UI with explicit scientific boundaries.
- Complete in-page English/Traditional Chinese switch backed by one shared set of inputs, calculations, result state, and validation codes.
- Browser-language startup plus a locally remembered language preference, with storage failure handled as a non-blocking fallback.
- Localized page metadata, static labels, dynamic results, warnings, validation errors, and accessibility labels.
- Mobile log-scale rows stack factor, track, and covered interval so long factor labels no longer share a narrow fixed column with the track.
- At 620 px and below, body copy, form labels, helper text, notices, result details, summaries, and footer copy use explicit mobile readability floors: 1rem primary copy, 0.95rem supporting copy, and 0.9rem compact detail text.
- Mobile inputs remain at least 1rem to avoid iOS text zoom, checkboxes are enlarged, and both language buttons have a 44 px-equivalent minimum touch height.
- The release badge now precedes the language control in the header; on mobile the badge is anchored to the left side of the top row and the non-wrapping language switch to the right. On desktop the language switch is likewise the rightmost tool.
- Dependency-free self-contained HTML build.
- MIT public-source license and a release-candidate privacy statement.
- Bounded public-release checklist that keeps external actions behind a separate release gate.

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
- `node --test tests/*.test.js`: **30 passed, 0 failed**. This retains all mathematical and boundary checks and adds static guards for the mobile type scale, top-row separation, rightmost language-switch order, no-wrap behavior, and 44 px-equivalent language-button height.
- `node --check src/planner.js`, `src/i18n.js`, and `src/app.js`: passed.
- Self-contained v0.3.1 build passed. Output is 78,563 bytes with SHA-256 `53014bec44913a9eed8260fa7d23ffd3ad8ab1674e39a0b0538d55f65da06117`.
- Static artifact checks passed: unique source IDs, all static app selectors resolved, 116 matching keys in both locales, no external dependency or network primitive, classic-script `file://` compatibility, required product/safety wording, viewport/accessibility scaffolding, and a local accessible language switch.
- Yao's v0.1 iPhone evidence confirmed the default calculation and exposed factor labels colliding with the chart track.
- Yao's 2026-09-03 v0.2 iPhone + Edge long screenshot accepted the English results section: the default calculation remains at 100% coverage, all four factors are correct, `396.8503×` and `7,905.6942×` are fully readable above their tracks, and no horizontal overflow or result-card clipping is visible through the footer.
- Yao's 2026-09-03 v0.3 Chinese-locale iPhone evidence accepted automatic Traditional Chinese selection, the unchanged default 100% calculation, visible factor labels, and unclipped Chinese content. Her explicit UX feedback was that phone text remained too small and the language control should be in the upper right; that feedback is the bounded reason for v0.3.1.
- Surface Microsoft Edge executed the earlier self-contained candidate at desktop and responsive mobile-breakpoint widths. Default calculation, EN/繁中 translation, input/result preservation, saved-language reload, bench-friendly factors, fixed-fold factors, linked validation errors, impossible-low-range handling, header separation, and horizontal-overflow checks passed.
- The hash-verified v0.3.1 artifact (`53014bec44913a9eed8260fa7d23ffd3ad8ab1674e39a0b0538d55f65da06117`) was transferred to a temporary folder on Lexian's Surface and exercised in Microsoft Edge headless with `--lang=zh-TW` at the responsive mobile breakpoint. It reported `html lang=zh-Hant`, default coverage `100%`, `innerWidth=492`, `clientWidth=477`, and both document/body `scrollWidth=477`, so no horizontal overflow was present. The badge rectangle was `10..166.6875` and the language-switch rectangle was `361.03125..467`; both stayed within the viewport with the badge left and language switch right.
- Computed v0.3.1 mobile sizes in that Edge run matched the intended scale: header/result/factor-primary copy 16 px, intro/supporting/factor-band/summary/footer copy 15.2 px, and preparation-detail labels 14.4 px. A 500 px screenshot also passed visual inspection with no header collision.
- In the current iOS ChatGPT file-preview flow, the preview's **Download** command did not save reliably. **Share → Save to Files** succeeded; this is delivery friction outside the planner artifact.
- The Work container itself had no browser executable, but the hash-matched artifact completed the bounded v0.3.1 Surface Edge smoke described above. Edge enforces a 492 px minimum inner width in this headless setup, so exact 390 CSS px iPhone fit and subjective reading comfort remain the owner-QA gate rather than being inferred from the Surface run.

## Known limits

- No staged intermediate-dilution protocol generation.
- No unit conversion.
- No OD/curve fitting or assay-type input.
- No scientific input/result persistence, PWA, offline service worker, analytics, backend, or remote data.
- Separate indexable `/` and `/zh-tw/` production paths and `hreflang` remain publication work.
- No support URL or payment provider is connected.
- No public repo, hosted URL, analytics, backend, service worker, or PWA identity exists.

## Next safe step

Hand Yao the v0.3.1 self-contained artifact for one focused iPhone check: confirm the larger copy is comfortable to read without zoom and the release badge stays left while the language switch stays independently at the upper right without wrapping, collision, or overflow. This is the only remaining iPhone acceptance point. After that evidence, the next boundary is a separately authorized public repo/deployment/support setup.
