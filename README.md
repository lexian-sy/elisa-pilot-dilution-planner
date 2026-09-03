# ELISA Pilot Dilution Planner

A local-only prototype that turns a user-defined usable assay range and a rough original target-analyte concentration range into a transparent pilot dilution coverage plan.

## Purpose and user

The tool is for researchers planning a first ELISA dilution scan before spending sample and plate wells. It calculates concentration coverage, direct-preparation volumes, well use, and pipetting-limit warnings. It does not choose biologically correct dilutions or validate an assay.

## Audience and localization

The product direction is global and English-first, with a complete Traditional Chinese interface for Taiwan and other Chinese-reading lab users. Both languages use the same inputs, calculation core, result model, and safety boundary.

The local prototype contains an in-page `EN / 繁中` switch and does not persist the choice after reload. Search-indexable production paths such as `/` and `/zh-tw/`, plus `hreflang`, remain part of a later publication stage and are not implemented in this checkpoint.

## Current state

- Stage: local prototype v0.2; automated checks pass and the bilingual/mobile-layout changes await Yao real-device QA.
- Active Work Mode path for this checkpoint: `/workspace/scratch/59ee1c8d5961/elisa-pilot-dilution-planner`
- Source entry: `index.html` (serve the repository root for development).
- Self-contained QA artifact: `dist/elisa-pilot-dilution-planner.html` (opens directly from `file://`).
- No remote, production URL, payment integration, analytics, backend, or stored user data exists.

## Run, test, and build

```sh
npm test
npm run build
npm run check
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/` for source-mode browser testing. The built file in `dist/` requires no server.

## Data and compatibility boundary

The prototype has no persistence layer, database, export schema, cache, service worker, or PWA scope. Inputs exist only in the current page state. There is therefore no user-data migration or backup format in v0.1.

## Publication and license

This checkpoint is not published and no public-source license has been selected. A future public repo, hosting, PWA identity, support link, and license each require a later decision and separate authorization.

## Known limits and next safe step

- Direct preparation is calculated independently from original sample for every factor. When the needed original volume is below the user-entered pipetting minimum, the tool flags that an intermediate dilution is required but does not invent a staged protocol.
- Auto mode uses a geometric-midpoint/log-spacing engineering heuristic and exposes gaps; it is not a vendor recommendation.
- Lower-bound-only uncertainty cannot establish coverage below the assay lower limit.
- Next safe step after local checks: Yao opens the self-contained artifact on iPhone and desktop and runs the focused v0.2 checklist in `docs/YAO_QA.md`. No deployment is needed for this gate.

## Attribution

The public-work direction is Lexian-led. The prototype footer uses `Built by Lexian`; no private shared-project logo was copied or regenerated for this stage.
