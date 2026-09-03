# Yao real-device QA — v0.3 release candidate

Use the v0.3 self-contained `elisa-pilot-dilution-planner.html` artifact. No account or network connection is required.

On iPhone, use **Share → Save to Files** from the preview. The preview's own **Download** command has been observed returning to the preview without reliably saving the file.

## Accepted on iPhone

- 2026-09-03, Edge external-file view: default English result shows 100% coverage and the expected four factors.
- `396.8503×` and `7,905.6942×` are fully readable above their tracks.
- No horizontal overflow or result-card clipping is visible from the coverage summary through the footer.

## Accepted on Surface Edge

- English/Traditional Chinese static and dynamic result text changes without losing inputs or calculated factors.
- The selected language survives reload; a Chinese browser locale starts in Traditional Chinese when no saved choice exists.
- Bench-friendly and fixed-fold factor sequences, linked validation errors, and the impossible-low-range stop are correct.
- Desktop and responsive mobile-breakpoint runs report no horizontal overflow or header collision.

## Final iPhone spot check

1. Open v0.3. On an iPhone using a Chinese browser locale, the interface should initially select **繁中**.
2. Leave the example values unchanged and tap **建立初次稀釋計畫**. Confirm the four factors remain `1 / 19.9211 / 396.8503 / 7905.6942`, coverage is 100%, and no Chinese text or factor label extends beyond its card.
3. Capture one screenshot containing the language switch and any result section. Stop only if the page starts in the wrong language, a number changes, or text is clipped.

## Stop and preserve evidence if

- any factor label overlaps the log-scale track or extends beyond its card;
- switching language changes or clears entered values, factors, or coverage;
- English and Chinese appear mixed within the same completed result;
- the page makes a network request or asks for login;
- a result says full coverage while a visible concentration gap remains;
- a volume is negative, `NaN`, or infinite;
- the page claims assay validation, biological suitability, or a vendor-recommended dilution.

For a stop condition, record the device/browser, selected language, exact input values, and one screenshot.
