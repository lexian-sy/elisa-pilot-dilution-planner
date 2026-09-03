# Agent working contract

This repository is the local-only prototype source for **ELISA Pilot Dilution Planner**.

- Read `README.md`, `CURRENT_STATUS.md`, `docs/MATH_MODEL.md`, and fresh Git state before changing code.
- Work in one coherent, bounded stage. Preserve unrelated user changes and do not broaden the scientific or product claims.
- Use only anonymous fixtures. Do not add real sample records, credentials, analytics, remote requests, or private data.
- The calculator plans mathematical concentration coverage and liquid volumes. It must not claim to validate assay performance, biological suitability, matrix effects, dilutional linearity, recovery, hook effect, or method compliance.
- `Usable assay range` always comes from the user. Do not silently replace it with a kit's full standard or detection range.
- The interface supports English and Traditional Chinese from one shared calculation core. Keep `src/i18n.js` locale keys in parity, translate dynamic errors and results as well as static labels, and use general public-facing pronouns rather than partner-specific language.
- Run `npm run check` after source changes. For UI changes, also run the bounded Playwright smoke check documented in `CURRENT_STATUS.md` when the browser runtime is available.
- Build output is `dist/elisa-pilot-dilution-planner.html`; it must remain self-contained and usable from `file://`.
- Do not push, deploy, change DNS, connect payment services, or make external commitments without a new explicit authorization.
- Record verified state, checks, limitations, and the next safe step in `CURRENT_STATUS.md`.
- A normal handoff must state, in plain language for Yao, what works, whether she needs to act, the single next step, stop conditions, and the exact handoff artifact. Preserve deeper technical evidence for Lex in the repo status document.
