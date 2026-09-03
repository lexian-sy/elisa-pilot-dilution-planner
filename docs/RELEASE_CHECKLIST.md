# Public release checklist

This checklist begins only after the v0.3.1 iPhone readability and header-placement check is accepted. Items that change external state require an explicit release authorization.

## Local release gate

- [x] Mathematical and boundary tests pass.
- [x] Self-contained artifact contains no external dependency or application network request.
- [x] English iPhone result layout is accepted.
- [x] English/Traditional Chinese state preservation and responsive layout pass in Microsoft Edge.
- [x] MIT license and privacy boundary are present.
- [x] Traditional Chinese iPhone startup, default 100% result, factor visibility, and unclipped content are accepted on v0.3.
- [x] v0.3.1 larger mobile typography and upper-right language-switch placement are accepted on a real iPhone.

## External release gate

- [x] Create the public GitHub repository and push the exact accepted commit.
- [x] Use the independent stable `workers.dev` hostname for the initial public beta.
- [x] Configure Cloudflare static hosting without analytics or a backend.
- [x] Add indexable English `/` and Traditional Chinese `/zh-tw/` routes, canonical URLs, and `hreflang` metadata.
- [x] Update `PRIVACY.md` with the actual hosting provider and public contact route.
- [x] Create and verify the support destination; expose it as an optional external footer link with no embedded checkout.
- [x] Run production smoke checks on iPhone and desktop, including loading, calculation, locale, and responsive-layout behavior appropriate to the current static hosting choice.
- [x] Publish the README, privacy statement, license, and clear scientific boundaries with the tool.
- [x] Record initial public-beta date, production URL, and first deployed commit. (Support platform and Lexian Fund gross/fees/net remain inapplicable until support is connected.)

## Initial public-beta record

- Date: 2026-09-03
- Production: <https://elisa-pilot-dilution-planner.lexian.workers.dev/>
- Traditional Chinese: <https://elisa-pilot-dilution-planner.lexian.workers.dev/zh-tw/>
- First deployed commit: `33d97c6`
- Exact-iPhone live acceptance: 2026-09-03
- Support platform: Buy Me a Coffee external link (`buymeacoffee.com/lexian`)
- Support-link deployed commit: `cc5382c`
- English and Traditional Chinese production-link check: 2026-09-03
