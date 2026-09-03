# ELISA Pilot Dilution Planner

A browser-only public beta that turns a user-defined usable assay range and a rough original target-analyte concentration range into a transparent pilot dilution coverage plan.

## Purpose and user

The tool is for researchers planning a first ELISA dilution scan before spending sample and plate wells. It calculates concentration coverage, direct-preparation volumes, well use, and pipetting-limit warnings. It does not choose biologically correct dilutions or validate an assay.

## Audience and localization

The product direction is global and English-first, with a complete Traditional Chinese interface for Taiwan and other Chinese-reading lab users. Both languages use the same inputs, calculation core, result model, and safety boundary.

The public beta contains an in-page `EN / 繁中` switch. The English root follows a supported saved preference first, then the browser language, and remembers later language choices locally. The `/zh-tw/` route opens in Traditional Chinese while preserving the same calculator and safety boundary.

## Current state

- Stage: public beta v0.4.0, deployed from the public repository through Cloudflare Workers Builds and accepted on desktop and iPhone.
- Source entry: `index.html` (serve the repository root for development).
- Self-contained QA artifact: `dist/elisa-pilot-dilution-planner.html` (opens directly from `file://`).
- Public source: <https://github.com/lexian-sy/elisa-pilot-dilution-planner>
- Live tool: <https://elisa-pilot-dilution-planner.lexian.workers.dev/>
- Traditional Chinese route: <https://elisa-pilot-dilution-planner.lexian.workers.dev/zh-tw/>
- Payment integration, analytics, and backend do not exist in this public beta.

## Run, test, and build

```sh
npm test
npm run build
npm run check
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/` for source-mode browser testing. The built file in `dist/` requires no server.

## Data and compatibility boundary

The public beta has no database, export schema, service worker, or PWA scope. Concentration inputs and results exist only in the current page state. The only application preference stored in the browser is the selected language; storage failures are tolerated. There is no scientific-data migration or backup format.

## Publication and license

The source is released under the MIT License; see `LICENSE`. The application privacy boundary is documented in `PRIVACY.md`. Cloudflare Workers configuration is version-controlled in `wrangler.jsonc`; pushes to `main` build and deploy the static site. Production preview URLs are disabled. Payment and support links remain separate release actions.

## Known limits and next safe step

- Direct preparation is calculated independently from original sample for every factor. When the needed original volume is below the user-entered pipetting minimum, the tool flags that an intermediate dilution is required but does not invent a staged protocol.
- Auto mode uses a geometric-midpoint/log-spacing engineering heuristic and exposes gaps; it is not a vendor recommendation.
- Lower-bound-only uncertainty cannot establish coverage below the assay lower limit.
- Next safe step: begin bounded public discovery and feedback collection from the stable `workers.dev` release. A custom hostname and any payment/support destination remain separate future release decisions.

## Attribution

The public-work direction is Lexian-led. The prototype footer uses `Built by Lexian`; no private shared-project logo was copied or regenerated for this stage.
