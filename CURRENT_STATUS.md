# Current status

## Checkpoint

- Product: ELISA Pilot Dilution Planner
- Stage: public beta v0.4.0 — deployed publicly from Lexian's GitHub repository through Lexian's Cloudflare account
- Date: 2026-09-03
- Authority boundary: Yao authorized Lexian to create and use independent GitHub and Cloudflare accounts, publish the repository, and continue through hosting. Do not change Yao's `lexiansy.space` DNS zone or connect payments without the separately required owner/financial step.

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
- Hosted build outputs for English `/` and Traditional Chinese `/zh-tw/` routes.
- Canonical, `hreflang`, Open Graph, `robots.txt`, and sitemap metadata for the two public language routes.
- Cloudflare Workers Static Assets configuration limited to `dist/`, with no Worker script, analytics, or backend.
- GitHub-connected Cloudflare Workers Builds for `main`, with the stable `workers.dev` URL enabled and deployment preview URLs disabled.
- MIT public-source license and a public-beta privacy statement.
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
- `node --test tests/*.test.js`: **33 passed, 0 failed**. This retains all mathematical and boundary checks and adds hosted-output parity, Traditional Chinese static-route, canonical/alternate URL, and public-discovery guards.
- `node --check src/planner.js`, `src/i18n.js`, and `src/app.js`: passed.
- Self-contained v0.4.0 build passed. The offline and hosted English outputs share SHA-256 `39088dda774cb7a02765a96fde2553dcd63e19315efaf22a9ff89e6e2b26521d`; the Traditional Chinese route output has SHA-256 `8f2e2be50537c00ea3a112fbc72e7d04d9e5cf5c90564bf1c8f8a53fe0825000`.
- Static artifact checks passed: unique source IDs, all static app selectors resolved, 116 matching keys in both locales, no external dependency or network primitive, classic-script `file://` compatibility, required product/safety wording, viewport/accessibility scaffolding, and a local accessible language switch.
- Yao's v0.1 iPhone evidence confirmed the default calculation and exposed factor labels colliding with the chart track.
- Yao's 2026-09-03 v0.2 iPhone + Edge long screenshot accepted the English results section: the default calculation remains at 100% coverage, all four factors are correct, `396.8503×` and `7,905.6942×` are fully readable above their tracks, and no horizontal overflow or result-card clipping is visible through the footer.
- Yao's 2026-09-03 v0.3 Chinese-locale iPhone evidence accepted automatic Traditional Chinese selection, the unchanged default 100% calculation, visible factor labels, and unclipped Chinese content. Her explicit UX feedback was that phone text remained too small and the language control should be in the upper right; that feedback is the bounded reason for v0.3.1.
- Surface Microsoft Edge executed the earlier self-contained candidate at desktop and responsive mobile-breakpoint widths. Default calculation, EN/繁中 translation, input/result preservation, saved-language reload, bench-friendly factors, fixed-fold factors, linked validation errors, impossible-low-range handling, header separation, and horizontal-overflow checks passed.
- The hash-verified v0.3.1 artifact (`53014bec44913a9eed8260fa7d23ffd3ad8ab1674e39a0b0538d55f65da06117`) was transferred to a temporary folder on Lexian's Surface and exercised in Microsoft Edge headless with `--lang=zh-TW` at the responsive mobile breakpoint. It reported `html lang=zh-Hant`, default coverage `100%`, `innerWidth=492`, `clientWidth=477`, and both document/body `scrollWidth=477`, so no horizontal overflow was present. The badge rectangle was `10..166.6875` and the language-switch rectangle was `361.03125..467`; both stayed within the viewport with the badge left and language switch right.
- Computed v0.3.1 mobile sizes in that Edge run matched the intended scale: header/result/factor-primary copy 16 px, intro/supporting/factor-band/summary/footer copy 15.2 px, and preparation-detail labels 14.4 px. A 500 px screenshot also passed visual inspection with no header collision.
- Yao then opened v0.3.1 on her real iPhone and explicitly accepted both focused UX points on 2026-09-03: the text size is comfortable and the language-switch position is correct (`「我看了，我覺得這樣大小跟位置都可以了」`). This closes the final subjective readability and exact-device header-placement gate.
- In the current iOS ChatGPT file-preview flow, the preview's **Download** command did not save reliably. **Share → Save to Files** succeeded; this is delivery friction outside the planner artifact.
- The Work container itself had no browser executable, but the hash-matched artifact completed the bounded v0.3.1 Surface Edge smoke described above. Edge enforces a 492 px minimum inner width in this headless setup; the previously outstanding exact-device fit and subjective comfort questions are now resolved by Yao's real-iPhone acceptance.
- Lexian created the public repository at `https://github.com/lexian-sy/elisa-pilot-dilution-planner`, transferred the full local Git history to the Surface, and pushed it using a device-local SSH key. The key remains on the Surface and was not copied into the repository or Work container.
- The first production deployment was built from commit `33d97c6` by Cloudflare Workers Builds. Both `https://elisa-pilot-dilution-planner.lexian.workers.dev/` and `/zh-tw/` returned HTTP 200 from the Surface; the live HTML identified the English auto-locale route and the forced Traditional Chinese route correctly.
- Surface Chrome completed the live default-plan smoke: 100% continuous coverage with `1×`, `19.9211×`, `396.8503×`, and `7,905.6942×`. Switching to English preserved the computed results, and direct navigation to `/zh-tw/` overrode the saved English preference as intended.

## Known limits

- No staged intermediate-dilution protocol generation.
- No unit conversion.
- No OD/curve fitting or assay-type input.
- No scientific input/result persistence, PWA, offline service worker, analytics, backend, or remote data.
- No support URL or payment provider is connected.
- The stable public beta uses the independent `workers.dev` hostname. A custom `lexiansy.space` hostname has not been requested from or configured in Yao's Cloudflare zone.
- Analytics, backend, service worker, and PWA identity do not exist.

## Next safe step

Run one exact-iPhone smoke check against the live `workers.dev` URL. After that, choose whether the independent hostname is sufficient for launch or whether to request the separate owner action needed for a `lexiansy.space` hostname. Payment/support setup remains a later financial-identity boundary.
