# Current status

## Checkpoint

- Product: ELISA Pilot Dilution Planner
- Stage: public beta v0.4.1 support-link release candidate — local and Surface checks passed; deployment pending
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
- Optional external Buy Me a Coffee support link in both interfaces; no embedded checkout or calculator-data transfer.

## Required check

```sh
npm run check
```

For UI changes, also verify the source page, self-contained artifact, and production routes at desktop and mobile widths. Exercise the default result, simplified factors, fixed-fold mode, validation linking, impossible-low-range handling, locale switching, and horizontal overflow.

## Evidence

- `npm run check`: passed.
- `node --test tests/*.test.js`: **34 passed, 0 failed**.
- Syntax checks for `src/planner.js`, `src/i18n.js`, and `src/app.js`: passed.
- The self-contained and hosted English outputs share SHA-256 `8be278361b6f8ce226ddc0288bf73d96590fa6c6e673f733dd8bf84c3e1e5505`.
- The Traditional Chinese hosted output has SHA-256 `d61cce582486c1d0205b7a9e006a6a15420d910e4d573c18b98e95fd0f979ac7`.
- Static checks confirm unique source IDs, complete selector/key parity, no external runtime dependency, classic-script `file://` compatibility, safety wording, and an accessible language switch.
- Desktop Edge/Chrome checks passed for default calculation, locale preservation, bench-friendly factors, fixed-fold factors, validation, and horizontal overflow.
- Real-iPhone checks passed for both public routes, the default 100% result, factor-label readability, mobile typography, header placement, and language switching.
- Surface local-file check passed for the v0.4.1 Traditional Chinese support label and its external navigation to `buymeacoffee.com/lexian`; the destination shows Lexian's research-tool identity and one-time support by default.
- Cloudflare Workers Builds deploys pushes from `main`; the first deployed commit was `33d97c6` and the localized public release is tagged `v0.4.0`.
- Repository metadata links directly to the live tool and includes focused discovery topics for ELISA, dilution calculation, laboratory work, research tools, JavaScript, and open source.

## Known limits

- No staged intermediate-dilution protocol generation.
- No unit conversion.
- No OD/curve fitting or assay-type input.
- No scientific input/result persistence, PWA, offline service worker, analytics, backend, or remote data.
- Support is an external link; payments, supporter identity, refunds, and payout processing remain on Buy Me a Coffee and its payment providers.
- The public beta uses the independent `workers.dev` hostname.

## Next safe step

Commit and push the exact v0.4.1 release candidate, then verify the support link from both production routes before submitting the first-payout moderation review. Keep a custom hostname and analytics as separate future decisions.
