# ELISA Pilot Dilution Planner

A local-only prototype that turns a user-defined usable assay range and a rough original target-analyte concentration range into a transparent pilot dilution coverage plan.

## Purpose and user

The tool is for researchers planning a first ELISA dilution scan before spending sample and plate wells. It calculates concentration coverage, direct-preparation volumes, well use, and pipetting-limit warnings. It does not choose biologically correct dilutions or validate an assay.

## Audience and localization

The product direction is global and English-first, with a complete Traditional Chinese interface for Taiwan and other Chinese-reading lab users. Both languages use the same inputs, calculation core, result model, and safety boundary.

The release candidate contains an in-page `EN / 繁中` switch. It follows a supported saved preference first, then the browser language, and remembers later language choices locally. Search-indexable production paths such as `/` and `/zh-tw/`, plus `hreflang`, remain publication work and are not implemented in this checkpoint.

## Current state

- Stage: local release candidate v0.3.1. Yao's v0.3 iPhone evidence accepted Traditional Chinese startup, the default 100% result, complete factor labels, and unclipped Chinese content; her readability and header-placement feedback is implemented in this mobile UX patch.
- Active Work Mode path for this checkpoint: `/workspace/scratch/59ee1c8d5961/elisa-pilot-dilution-planner`
- Source entry: `index.html` (serve the repository root for development).
- Self-contained QA artifact: `dist/elisa-pilot-dilution-planner.html` (opens directly from `file://`).
- No remote, production URL, payment integration, analytics, or backend exists.

## Run, test, and build

```sh
npm test
npm run build
npm run check
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/` for source-mode browser testing. The built file in `dist/` requires no server.

## Data and compatibility boundary

The release candidate has no database, export schema, service worker, or PWA scope. Concentration inputs and results exist only in the current page state. The only application preference stored in the browser is the selected language; storage failures are tolerated. There is no scientific-data migration or backup format.

## Publication and license

The source is prepared for release under the MIT License; see `LICENSE`. The application privacy boundary is documented in `PRIVACY.md`. This checkpoint is not published. A public repo, hosting, locale URLs, PWA identity, and support link remain separate release actions.

## Known limits and next safe step

- Direct preparation is calculated independently from original sample for every factor. When the needed original volume is below the user-entered pipetting minimum, the tool flags that an intermediate dilution is required but does not invent a staged protocol.
- Auto mode uses a geometric-midpoint/log-spacing engineering heuristic and exposes gaps; it is not a vendor recommendation.
- Lower-bound-only uncertainty cannot establish coverage below the assay lower limit.
- Next safe step: Yao performs the single v0.3.1 iPhone UX check in `docs/YAO_QA.md`: confirm the larger mobile type is comfortable and the language switch stays at the upper right without crowding the release badge. After that gate, use `docs/RELEASE_CHECKLIST.md` for the separately authorized public release.

## Attribution

The public-work direction is Lexian-led. The prototype footer uses `Built by Lexian`; no private shared-project logo was copied or regenerated for this stage.
