# Yao real-device QA — v0.3.1 accepted

Use the v0.3.1 self-contained `elisa-pilot-dilution-planner.html` artifact. No account or network connection is required.

On iPhone, use **Share → Save to Files** from the preview. The preview's own **Download** command has been observed returning to the preview without reliably saving the file.

## Accepted on iPhone

- 2026-09-03, Edge external-file view: default English result shows 100% coverage and the expected four factors.
- `396.8503×` and `7,905.6942×` are fully readable above their tracks.
- No horizontal overflow or result-card clipping is visible from the coverage summary through the footer.
- 2026-09-03, Chinese-locale iPhone evidence: the page starts in Traditional Chinese, the unchanged example calculates 100% coverage, visible factors and Chinese text are not clipped, and the shared calculation behavior remains correct.
- The same evidence produced one clear UX finding: supporting and result-detail text is too small for comfortable phone reading, and the language switch belongs at the upper right.
- 2026-09-03, v0.3.1 real-iPhone follow-up: Yao accepted the increased text size and the language-switch position (`「我看了，我覺得這樣大小跟位置都可以了」`). The final mobile readability and header-placement gate is closed.

## Accepted on Surface Edge

- English/Traditional Chinese static and dynamic result text changes without losing inputs or calculated factors.
- The selected language survives reload; a Chinese browser locale starts in Traditional Chinese when no saved choice exists.
- Bench-friendly and fixed-fold factor sequences, linked validation errors, and the impossible-low-range stop are correct.
- Desktop and responsive mobile-breakpoint runs report no horizontal overflow or header collision.
- The hash-matched v0.3.1 artifact passed a new `--lang=zh-TW` headless run: Traditional Chinese startup, default 100% coverage, equal 477 px client/document/body widths, left-side badge and right-side language control inside the viewport, intended 16/15.2/14.4 px mobile type scale, and a visually clean 500 px screenshot. Edge's enforced 492 px minimum inner width did not replace the real-iPhone comfort/fit check; Yao's later device acceptance supplied that final evidence.

## Completed v0.3.1 iPhone UX check

1. Yao opened the self-contained v0.3.1 artifact on her real iPhone after saving it through **Share → Save to Files**.
2. She reviewed the larger mobile text and the repositioned language control in the upper-right header area.
3. She explicitly accepted both size and position. Earlier iPhone evidence already accepted the default 100% result, the four factors, Traditional Chinese startup, and unclipped content.
4. No iPhone acceptance point remains for the local release candidate. Public release and production verification begin only under separate authorization.

## Stop and preserve evidence if

- any factor label overlaps the log-scale track or extends beyond its card;
- the top-row badge and language switch overlap, wrap into each other, or overflow the viewport;
- supporting copy still requires browser zoom for comfortable reading;
- switching language changes or clears entered values, factors, or coverage;
- English and Chinese appear mixed within the same completed result;
- the page makes a network request or asks for login;
- a result says full coverage while a visible concentration gap remains;
- a volume is negative, `NaN`, or infinite;
- the page claims assay validation, biological suitability, or a vendor-recommended dilution.

For a stop condition, record the device/browser, selected language, exact input values, and one screenshot.
