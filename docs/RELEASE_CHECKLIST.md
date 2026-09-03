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
- [ ] Configure Cloudflare static hosting without analytics or a backend.
- [ ] Add indexable English `/` and Traditional Chinese `/zh-tw/` routes, canonical URLs, and `hreflang` metadata. (The route outputs exist; production URLs remain pending.)
- [x] Update `PRIVACY.md` with the actual hosting provider and public contact route.
- [ ] Create and verify the support destination; expose the support link only after it works end to end.
- [ ] Run production smoke checks on iPhone and desktop, including offline/error behavior appropriate to the final hosting choice.
- [ ] Publish the README, privacy statement, license, and clear scientific boundaries with the tool.
- [ ] Record launch date, production URL, commit, support platform, and future Lexian Fund income as gross/fees/net.
