# Current status

## Checkpoint

- Product: ELISA Pilot Dilution Planner
- Stage: public beta v0.4.1 — Google Search Console verification artifact deployed and verified
- Date: 2026-09-06
- Public source: <https://github.com/lexian-sy/elisa-pilot-dilution-planner>
- Production: <https://elisa-planner.lexiansy.space/>
- Traditional Chinese: <https://elisa-planner.lexiansy.space/zh-tw/>
- English guide: <https://elisa-planner.lexiansy.space/guides/choosing-elisa-pilot-dilutions/>
- Traditional Chinese guide: <https://elisa-planner.lexiansy.space/zh-tw/guides/choosing-elisa-pilot-dilutions/>
- Google verification: <https://elisa-planner.lexiansy.space/google15c6b5cc59503001.html>

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
- Canonical custom hostname elisa-planner.lexiansy.space is fronted by a thin Cloudflare Worker bridge; the calculator itself remains static and backend-free.
- Static English and Traditional Chinese guides explain how to choose pilot dilution points from a user-supplied usable assay range without extending the calculator's scientific claims.
- Root and hosted-build copies of the owner-supplied Google Search Console HTML verification artifact.
- Both guide routes provide unique title and description metadata, canonical and reciprocal `hreflang`, Article and visible FAQ structured data, official manufacturer references, and language-correct planner calls to action.
- Each planner route links compactly to its matching guide; switching the in-page language also updates that guide target while preserving local-file behavior.

## Required check

```sh
npm run check
```

For UI changes, also verify the source page, self-contained artifact, and production routes at desktop and mobile widths. Exercise the default result, simplified factors, fixed-fold mode, validation linking, impossible-low-range handling, locale switching, and horizontal overflow.

## Evidence

- 2026-09-06 verification-release baseline: clean `main` matched `origin/main` at `e15f1da965f2c0c4c94909eb0e944f9a5bce1a76` after a fresh fetch.
- Implementation commit `3f37f87f81f78e525cca75e24ad575aba4faca23` was pushed to `origin/main`.
- `npm run check` passed with **40 tests, 0 failures**, including a deterministic byte-exact hosted-verification-artifact test; all three JavaScript syntax checks passed.
- The owner download, repository-root file, and `dist/google15c6b5cc59503001.html` are each 53 bytes with SHA-256 `02ce3c62598b201d30e02e32af9e87aac8e4d5f12e3ff9b6adc87397569dfb20`.
- Production readback of `https://elisa-planner.lexiansy.space/google15c6b5cc59503001.html` returned HTTP 200 `text/html`, 53 bytes, and an exact byte match to the owner download after the implementation push.
- Clean baseline: `main` matched `origin/main` at `651e4fc`; `npm run check` passed with **34 tests, 0 failures** before edits.
- Implementation commit `d70b683dc32e379c73beb2db50fba16df05f2541` was pushed to `origin/main`.
- `npm run check`: passed after implementation.
- `node --test tests/*.test.js`: **39 passed, 0 failed**.
- Syntax checks for `src/planner.js`, `src/i18n.js`, and `src/app.js`: passed.
- The self-contained and hosted English planner outputs share SHA-256 `3ef4aa8deba5cb6838c49eabb2973931c17869f2503c1147bb91c8f44f47ca67`.
- The Traditional Chinese hosted planner output has SHA-256 `4e2c8875bad77b935d30d63e336d0227df6fbbb43990d4a204a50c53b18e135f`.
- The built English and Traditional Chinese guides have SHA-256 `4de95a7c824a946394d9c60546b1a816066952f369fdf78fc13cb53e016462a6` and `8594647c8508d5f8720b8ac7f4398b4fc5f95925b1861a0d32d3e17298e6a41d`.
- `dist/sitemap.xml` has SHA-256 `92c47c45c65aa32026d7b4849256759eebbcaa80c7efe5ed78d4854cc326f7eb`.
- Static checks confirm unique source IDs, complete selector/key parity, no external runtime dependency, classic-script `file://` compatibility, safety wording, and an accessible language switch.
- Added deterministic checks for both guide routes, localized canonical and `hreflang` values, sitemap entries, planner CTA targets, supported structured data, prohibited identity markers, and absence of analytics or remote runtime dependencies.
- Local static-server readback returned HTTP 200 `text/html` for `/`, `/zh-tw/`, and both guide routes. The environment exposed neither a browser surface nor an installed Playwright package, so no screenshot-based visual smoke was claimed.
- Desktop Edge/Chrome checks passed for default calculation, locale preservation, bench-friendly factors, fixed-fold factors, validation, and horizontal overflow.
- Real-iPhone checks passed for both public routes, the default 100% result, factor-label readability, mobile typography, header placement, and language switching.
- Surface local-file check passed for the v0.4.1 Traditional Chinese support label and its external navigation to `buymeacoffee.com/lexian`; the destination shows Lexian's research-tool identity and one-time support by default.
- Cloudflare Workers Builds deploys pushes from `main`; the first deployed commit was `33d97c6` and the localized public release is tagged `v0.4.0`.
- Production smoke checks on commit `cc5382c` confirmed `Support this tool` on `/`, `支持這個工具` on `/zh-tw/`, and navigation to Lexian's live Buy Me a Coffee page.
- Repository metadata links directly to the live tool and includes focused discovery topics for ELISA, dilution calculation, laboratory work, research tools, JavaScript, and open source.
- 2026-09-05 custom-hostname smoke checks: https://elisa-planner.lexiansy.space/ and /zh-tw/ both returned HTTP 200 text/html through the verified bridge.
- 2026-09-06 production readback after `d70b683`: both guide URLs returned HTTP 200 with the expected localized title and canonical, both planner routes exposed the new guide link, and the sitemap listed both guide URLs. The deployed guide and sitemap byte hashes matched the local build; planner page content matched after line-ending normalization.

## Known limits

- No staged intermediate-dilution protocol generation.
- No unit conversion.
- No OD/curve fitting or assay-type input.
- No scientific input/result persistence, PWA, offline service worker, analytics, backend, or remote data.
- Support is an external link; payments, supporter identity, refunds, and payout processing remain on Buy Me a Coffee and its payment providers.
- The canonical public hostname is `elisa-planner.lexiansy.space`; the independent `workers.dev` origin remains reachable as an infrastructure fallback.

## Next safe step

The owner can run Google Search Console's HTML-file verification for the intended property. Stop if Search Console reports a token or property mismatch; do not change DNS or Cloudflare configuration as part of this handoff.
