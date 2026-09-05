## For Yao

The public site now has an English and Traditional Chinese guide for choosing ELISA pilot dilutions when the original sample concentration is uncertain. Each planner page has a small link to its matching guide, and each guide leads back to the correct planner. The calculator inputs, results, formulas, and scientific boundary were not changed.

No operational action is required. The remaining human check is to read both live pages once on a desktop and a phone. If the wording, layout, or call-to-action placement is uncomfortable, stop and open a focused revision; otherwise leave this release unchanged.

## For Lex

**Baseline:** The worktree was clean, `main` matched `origin/main` at `651e4fc`, and the pre-edit `npm run check` passed with 34 tests and no failures.

**Implemented:** Added static English and Traditional Chinese guide sources and generated route artifacts, shared guide styling, a language-aware planner-to-guide link, unique localized SEO and Open Graph metadata, canonical and reciprocal `hreflang`, Article and visible FAQ structured data, official manufacturer references, and guide sitemap entries. Added the fixed handoff-file contract to `AGENTS.md`. No calculator math, input, output, hosting configuration, analytics, account, cookie, or data-collection behavior changed.

**Commit and push:** Content commit `d70b683dc32e379c73beb2db50fba16df05f2541` was pushed from `main` to `origin/main` and triggered the existing production deployment.

**Regression:** Final `npm run check` passed. `node --test tests/*.test.js` reported 39 passing and 0 failing tests. JavaScript syntax checks passed. Deterministic tests cover both guide routes, localized titles and descriptions, canonical and `hreflang`, sitemap entries, CTA targets, Article and FAQ support, prohibited identity markers, and absence of analytics or remote runtime dependencies. `git diff --check` passed before the content commit.

**Local readback:** A local static server returned HTTP 200 `text/html` for `/`, `/zh-tw/`, `/guides/choosing-elisa-pilot-dilutions/`, and `/zh-tw/guides/choosing-elisa-pilot-dilutions/`. The machine exposed no browser surface and had no installed Playwright package, so screenshot-based browser verification was unavailable and is not claimed.

**Production readback at 2026-09-06 00:17 +08:00:** Both guide URLs returned HTTP 200 and contained the expected localized title and canonical. Both planner routes contained the guide entry point. The production sitemap returned HTTP 200 and listed both guide URLs. Production guide and sitemap bytes matched the local build exactly. The production planner pages matched the local content after CRLF/LF normalization.

**Hashes:** English guide `4de95a7c824a946394d9c60546b1a816066952f369fdf78fc13cb53e016462a6`; Traditional Chinese guide `8594647c8508d5f8720b8ac7f4398b4fc5f95925b1861a0d32d3e17298e6a41d`; sitemap `92c47c45c65aa32026d7b4849256759eebbcaa80c7efe5ed78d4854cc326f7eb`; English planner and offline artifact `3ef4aa8deba5cb6838c49eabb2973931c17869f2503c1147bb91c8f44f47ca67`; Traditional Chinese planner `4e2c8875bad77b935d30d63e336d0227df6fbbb43990d4a204a50c53b18e135f`.

**Current final state:** The requested guide content is live at both canonical routes, crawlable, localized, internally linked, and included in the sitemap. The offline calculator remains self-contained and usable from `file://`.

**Rollback:** Revert `d70b683dc32e379c73beb2db50fba16df05f2541` and push `main`; the existing pipeline will remove the guide routes, sitemap entries, and planner links while restoring the prior generated artifacts. Revert the documentation follow-up separately only if its status record also needs removal.

**P0 / P1:** None open.

**Deferred P2 / unknown:** Visual rendering was not exercised through a local browser because no browser surface or Playwright runtime was available. No internal deployment identifier was available; current production content was verified directly at the canonical hostname.

**Next safe step:** Review both live guide routes once on desktop and phone. Stop for a focused revision if content or layout is not acceptable; otherwise begin bounded public discovery without adding analytics. Exact handoff artifact: `handoffs/2026-09-06-public-discovery-elisa-pilot-dilution-guide.md`.
