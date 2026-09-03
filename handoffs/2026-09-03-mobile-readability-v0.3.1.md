# v0.3.1 mobile readability acceptance checkpoint

## Outcome

The v0.3.1 self-contained planner retained the accepted calculation and Traditional Chinese behavior while addressing two real-iPhone UX findings:

- Mobile body text, hints, labels, notices, result details, summaries, and footer copy were enlarged.
- The release badge remains at the upper left and the language switch at the upper right without wrapping or collision.
- Both language buttons meet a 44 px-equivalent minimum touch height.
- The calculation core, coverage rules, direct-preparation logic, scientific boundaries, and local-only behavior were unchanged.

Real-device follow-up accepted the increased text size and language-switch position. This closed the final local readability and exact-device header-placement gate before the v0.4.0 public beta.

## Verification

- `npm run check`: passed.
- `node --test tests/*.test.js`: 30 passed, 0 failed at this checkpoint.
- JavaScript syntax checks passed.
- `git diff --check`: passed.
- Artifact SHA-256: `53014bec44913a9eed8260fa7d23ffd3ad8ab1674e39a0b0538d55f65da06117`.
- Static no-network and accessibility assertions passed.
- A hash-matched Edge run with `--lang=zh-TW` verified Traditional Chinese startup, default 100% coverage, no horizontal overflow, left-badge/right-language geometry, and the intended mobile type scale.
- A real iPhone supplied the final subjective readability and exact-device layout acceptance.

## Related records

- Product state: `CURRENT_STATUS.md`
- Device evidence: `docs/REAL_DEVICE_QA.md`
- Release gate: `docs/RELEASE_CHECKLIST.md`
- Scientific model: `docs/MATH_MODEL.md`
