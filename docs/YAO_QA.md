# Yao real-device QA — v0.3.1 mobile readability patch

Use the v0.3.1 self-contained `elisa-pilot-dilution-planner.html` artifact. No account or network connection is required.

On iPhone, use **Share → Save to Files** from the preview. The preview's own **Download** command has been observed returning to the preview without reliably saving the file.

## Accepted on iPhone

- 2026-09-03, Edge external-file view: default English result shows 100% coverage and the expected four factors.
- `396.8503×` and `7,905.6942×` are fully readable above their tracks.
- No horizontal overflow or result-card clipping is visible from the coverage summary through the footer.
- 2026-09-03, Chinese-locale iPhone evidence: the page starts in Traditional Chinese, the unchanged example calculates 100% coverage, visible factors and Chinese text are not clipped, and the shared calculation behavior remains correct.
- The same evidence produced one clear UX finding: supporting and result-detail text is too small for comfortable phone reading, and the language switch belongs at the upper right.

## Accepted on Surface Edge

- English/Traditional Chinese static and dynamic result text changes without losing inputs or calculated factors.
- The selected language survives reload; a Chinese browser locale starts in Traditional Chinese when no saved choice exists.
- Bench-friendly and fixed-fold factor sequences, linked validation errors, and the impossible-low-range stop are correct.
- Desktop and responsive mobile-breakpoint runs report no horizontal overflow or header collision.

## Final v0.3.1 iPhone UX check

1. Open v0.3.1 on the same iPhone. In the top row, confirm the release-candidate badge is on the left and the **EN / 繁中** switch is independently aligned to the upper right. Neither item should wrap, overlap, or leave the screen, and both language buttons should be easy to tap.
2. Scan the intro, form labels and help text, then leave the example values unchanged and tap **建立初次稀釋計畫**. Confirm body copy, hints, notices, coverage details, liquid-volume details, summary, and footer are now comfortably readable without browser zoom.
3. Confirm the four factors remain `1 / 19.9211 / 396.8503 / 7905.6942`, coverage remains 100%, and no Chinese text or factor label extends beyond its card.
4. Capture one top-of-page screenshot and one representative result screenshot. This readability/header-placement confirmation is the only remaining iPhone acceptance point.

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
