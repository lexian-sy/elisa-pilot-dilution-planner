# Google Search Console verification release handoff

## For Yao

- What works: the owner-supplied verification file is committed at the repository root, copied byte-for-byte into the hosted build, covered by a deterministic test, and live at `https://elisa-planner.lexiansy.space/google15c6b5cc59503001.html`.
- Release boundary: no calculator, guide, public copy, identity, DNS, Cloudflare configuration, analytics, payments, or dependencies changed.
- Reviewer action: no deployment repair is needed. Preserve this exact file and body while Search Console verification is in use.

## For Lex

- Single next step: in Google Search Console, run the HTML-file verification for the intended property now that the canonical URL returns the exact token.
- Stop conditions: if Google reports a token mismatch, wrong property, or a different verification method, stop and inspect the property and Google-provided error. Do not change DNS or Cloudflare configuration under this handoff.
- Exact handoff artifact: `handoffs/2026-09-06-google-search-console-verification-release.md`.

## Evidence

- Baseline: clean `main` equaled `origin/main` at `e15f1da965f2c0c4c94909eb0e944f9a5bce1a76` after a fresh fetch.
- Implementation: `3f37f87f81f78e525cca75e24ad575aba4faca23` on `main` adds the root artifact, binary build copy, built artifact, and one focused test.
- Artifact: 53 bytes; SHA-256 `02ce3c62598b201d30e02e32af9e87aac8e4d5f12e3ff9b6adc87397569dfb20`; owner download, repository root, `dist`, and production response matched byte-for-byte.
- Regression: `npm run check` passed with 40 tests, 0 failures, and all required syntax checks.
- Live readback: HTTP 200, `text/html`, 53 bytes, exact expected body.

## Final state and rollback

- Current release state: the verification artifact is deployed and verified by direct readback; the final evidence commit is pushed to `main`, `main` equals `origin/main`, and the worktree is clean.
- Rollback path: revert implementation commit `3f37f87f81f78e525cca75e24ad575aba4faca23`, rebuild, run `npm run check`, push `main`, and confirm the verification URL is no longer served. This deliberately invalidates HTML-file verification and should only be done when the owner no longer needs it.
- P0/P1: none.
- Deferred P2: none.
- Unknown: Google Search Console's property-level acceptance remains an owner action; this release verifies only the required public file response.
