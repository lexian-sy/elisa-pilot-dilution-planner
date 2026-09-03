# Current status

## Checkpoint

- Product: ELISA Pilot Dilution Planner
- Stage: public beta v0.4.0 — deployed and accepted on desktop and iPhone
- Date: 2026-09-03
- Public source: <https://github.com/lexian-sy/elisa-pilot-dilution-planner>
- Production: <https://elisa-pilot-dilution-planner.lexian.workers.dev/>
- Traditional Chinese: <https://elisa-pilot-dilution-planner.lexian.workers.dev/zh-tw/>

## Implemented

- Auto Centered Coverage with raw log-spaced factors.
- Gap union and minimum-point reporting.
- Safe `1 / 2 / 5 × 10^n` simplified factors only after a full coverage re-check.
- Fixed-fold evaluation mode.
- Direct-preparation sample/diluent math, well budget, and minimum-pipette warnings.
- Validation for usable range, expected range, volume, replicates, point count, and mode inputs.
- One shared calculation core with complete English and Traditional Chinese interfaces.
- Browser-language startup and a locally remembered language preference.
- Responsive result tracks, readable mobile typography, and a 44 px-equivalent language control.
- Dependency-free self-contained HTML build.
- Hosted English `/` and Traditional Chinese `/zh-tw/` routes.
- Canonical, `hreflang`, Open Graph, `robots.txt`, and sitemap metadata.
- Cloudflare Workers Static Assets deployment with no Worker script, analytics, or backend.
- MIT license, public privacy statement, and explicit scientific boundaries.

## Required check

```sh
npm run check
```

For UI changes, also verify the source page, self-contained artifact, and production routes at desktop and mobile widths. Exercise the default result, simplified factors, fixed-fold mode, validation linking, impossible-low-range handling, locale switching, and horizontal overflow.

## Evidence

- `npm run check`: passed.
- `node --test tests/*.test.js`: **33 passed, 0 failed**.
- Syntax checks for `src/planner.js`, `src/i18n.js`, and `src/app.js`: passed.
- The self-contained and hosted English outputs share SHA-256 `39088dda774cb7a02765a96fde2553dcd63e19315efaf22a9ff89e6e2b26521d`.
- The Traditional Chinese hosted output has SHA-256 `8f2e2be50537c00ea3a112fbc72e7d04d9e5cf5c90564bf1c8f8a53fe0825000`.
- Static checks confirm unique source IDs, complete selector/key parity, no external runtime dependency, classic-script `file://` compatibility, safety wording, and an accessible language switch.
- Desktop Edge/Chrome checks passed for default calculation, locale preservation, bench-friendly factors, fixed-fold factors, validation, and horizontal overflow.
- Real-iPhone checks passed for both public routes, the default 100% result, factor-label readability, mobile typography, header placement, and language switching.
- Cloudflare Workers Builds deploys pushes from `main`; the first deployed commit was `33d97c6` and the localized public release is tagged `v0.4.0`.
- Repository metadata links directly to the live tool and includes focused discovery topics for ELISA, dilution calculation, laboratory work, research tools, JavaScript, and open source.

## Known limits

- No staged intermediate-dilution protocol generation.
- No unit conversion.
- No OD/curve fitting or assay-type input.
- No scientific input/result persistence, PWA, offline service worker, analytics, backend, or remote data.
- No support URL or payment provider is connected.
- The public beta uses the independent `workers.dev` hostname.

## Next safe step

Use the stable public beta for a bounded discovery pass and collect real-user feedback before adding product scope. Keep a custom hostname, analytics, and payment/support setup as separate future decisions.
