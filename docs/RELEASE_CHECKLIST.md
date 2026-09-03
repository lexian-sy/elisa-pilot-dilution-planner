# Public release checklist

This checklist begins only after the v0.3.1 iPhone readability and header-placement check is accepted. Items that change external state require an explicit release authorization.

## Local release gate

- [x] Mathematical and boundary tests pass.
- [x] Self-contained artifact contains no external dependency or application network request.
- [x] English iPhone result layout is accepted.
- [x] English/Traditional Chinese state preservation and responsive layout pass in Microsoft Edge.
- [x] MIT license and privacy boundary are present.
- [x] Traditional Chinese iPhone startup, default 100% result, factor visibility, and unclipped content are accepted on v0.3.
- [x] v0.3.1 larger mobile typography and upper-right language-switch placement are accepted on Yao's real iPhone.

## External release gate

- [x] Create the public GitHub repository and push the exact accepted commit.
- [ ] Choose the production hostname under `lexiansy.space`.
- [x] Configure Cloudflare static hosting without analytics or a backend.
- [x] Add indexable English `/` and Traditional Chinese `/zh-tw/` routes, canonical URLs, and `hreflang` metadata.
- [x] Update `PRIVACY.md` with the actual hosting provider and public contact route.
- [ ] Create and verify the support destination; expose the support link only after it works end to end.
- [ ] Run production smoke checks on iPhone and desktop, including offline/error behavior appropriate to the final hosting choice. (Surface HTTP and interactive Chrome checks pass; exact-iPhone live-URL check remains.)
- [x] Publish the README, privacy statement, license, and clear scientific boundaries with the tool.
- [x] Record initial public-beta date, production URL, and first deployed commit. (Support platform and Lexian Fund gross/fees/net remain inapplicable until support is connected.)

## Initial public-beta record

- Date: 2026-09-03
- Production: <https://elisa-pilot-dilution-planner.lexian.workers.dev/>
- Traditional Chinese: <https://elisa-pilot-dilution-planner.lexian.workers.dev/zh-tw/>
- First deployed commit: `33d97c6`
- Support platform: not connected
