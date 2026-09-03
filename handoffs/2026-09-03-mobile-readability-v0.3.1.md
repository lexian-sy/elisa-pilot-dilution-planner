# v0.3.1 mobile readability acceptance checkpoint

## For Yao

The v0.3.1 self-contained planner keeps the accepted v0.3 calculation and Traditional Chinese behavior, while directly addressing the two iPhone UX findings:

- Phone body text, hints, form labels, notices, result details, summaries, and footer copy are larger. The mobile scale now uses 16 px primary copy, about 15.2 px supporting copy, and at least 14.4 px compact details.
- The release-candidate badge sits at the upper left and the language switch sits independently at the upper right. The two controls cannot wrap into each other, and each language button has a 44 px-equivalent minimum touch height.
- The desktop header keeps the same visual character and large title; the language switch is also the rightmost desktop tool.
- The default math, coverage rules, direct-preparation logic, scientific boundaries, and local-only behavior were not changed.

The automated checkpoint and bounded Surface Edge v0.3.1 smoke are green. Yao opened the self-contained HTML on her real iPhone and accepted the larger text and updated control position: `「我看了，我覺得這樣大小跟位置都可以了」`. The final local iPhone gate is closed; Yao does not need to do another local acceptance step.

The single next step is separately authorized public-release work. Stop before any public repository/push, deployment, DNS, locale-route, support, analytics, payment, backend, or other external-state change unless that release authority is explicitly granted.

Exact handoff artifact: `handoffs/2026-09-03-mobile-readability-v0.3.1.md`.

## For Lex

### Sources read

- Repository working contract: `AGENTS.md`
- Product and checkpoint state: `README.md`, `CURRENT_STATUS.md`
- Scientific boundary: `docs/MATH_MODEL.md`
- QA/release gates: `docs/YAO_QA.md`, `docs/RELEASE_CHECKLIST.md`
- Relevant source and tests: `index.html`, `styles.css`, `src/app.js`, `src/i18n.js`, `package.json`, `tests/artifact.test.js`
- Fresh Git before edits: clean `main` at `4565719` (`feat: prepare bilingual v0.3 release candidate`)
- Yao's two supplied real-iPhone screenshots, including Traditional Chinese startup/default result evidence and the explicit readability/header feedback

### Changes

- Bumped the package and visible English/Traditional Chinese candidate badge from v0.3.0/v0.3 to v0.3.1.
- Reordered header tools so the candidate badge precedes the language control; desktop therefore keeps the switch rightmost.
- Added a bounded `max-width: 620px` typography scale and applied it across intro copy, mode copy, labels, helpers, errors, notices, result hero/detail rows, preparation details, summary, scientific boundary, and footer.
- Increased mobile inputs and checkboxes; made language controls at least 3rem wide and 2.75rem (44 px) high.
- Made the mobile top row non-wrapping and full-width with `space-between`, keeping the badge left and language control right.
- Added two static tests for mobile typography floors and top-row/control geometry.
- Updated README, current status, Yao QA, and release checklist to record v0.3 iPhone functional acceptance and the focused v0.3.1 owner gate.
- Built the self-contained artifact at `dist/elisa-pilot-dilution-planner.html`.

### Verification

- `npm run check`: passed.
- `node --test tests/*.test.js`: 30 passed, 0 failed.
- JavaScript syntax checks for planner, i18n, and app: passed through `npm run check`.
- `git diff --check`: passed.
- Artifact size: 78,563 bytes.
- Artifact SHA-256: `53014bec44913a9eed8260fa7d23ffd3ad8ab1674e39a0b0538d55f65da06117`.
- Self-contained/no-network/static accessibility assertions: passed in the automated suite.
- The exact hash-matched artifact was transferred to a temporary folder on Lexian's Surface and tested in Microsoft Edge headless with `--lang=zh-TW` at the responsive mobile breakpoint. Results: `html lang=zh-Hant`; default coverage `100%`; `innerWidth=492`; `clientWidth=477`; document and body `scrollWidth=477`; badge rectangle `10..166.6875`; language-switch rectangle `361.03125..467`. This verifies no horizontal overflow and the intended left-badge/right-language geometry at Edge's available mobile width.
- Computed styles were header copy 16 px, intro/supporting copy 15.2 px, result copy 16 px, factor main 16 px, factor band 15.2 px, preparation-detail label 14.4 px, and summary/footer copy 15.2 px. Visual inspection of the 500 px screenshot found no header collision.
- Browser limitation: the Work container itself has no browser executable and Edge's headless window enforces a 492 px minimum inner width. The Surface evidence therefore does not replace exact 390 CSS px iPhone layout or subjective comfort acceptance.

### Git and authority boundary

- The checkpoint commit is the commit containing this handoff; its immutable hash is reported alongside the handoff because a Git commit cannot embed its own final hash.
- Final expected state: clean working tree on `main` after the local commit.
- No push, deployment, DNS, payment, analytics, backend, network feature, or external commitment was performed.
- No calculation core, model input, scientific claim, or assay boundary changed.

### Remaining risk and next safe construction point

The subjective/physical iPhone readability and exact-device header-placement risk is resolved by Yao's real-iPhone acceptance on 2026-09-03. The local release gate is fully closed. The next safe construction point is the external release checklist, which requires separate authorization before any public repository/push, deployment, DNS, locale-route, support, privacy-host, production-verification, analytics, payment, backend, or other external-state action.
