# Real-device QA — v0.4.0 accepted

## Accepted on iPhone

- The public English and Traditional Chinese routes load successfully.
- The default example calculates 100% coverage with the expected four factors.
- Long factor labels remain fully readable above their tracks.
- No horizontal overflow or result-card clipping is visible from the coverage summary through the footer.
- English/Traditional Chinese switching preserves inputs and calculated results.
- Mobile body text is comfortable to read and the language switch remains in the upper-right header area.

## Accepted on desktop Edge and Chrome

- English/Traditional Chinese static and dynamic result text changes without losing inputs or calculated factors.
- The selected language survives reload; a Chinese browser locale starts in Traditional Chinese when no saved choice exists.
- Bench-friendly and fixed-fold factor sequences, linked validation errors, and the impossible-low-range stop are correct.
- Desktop and responsive mobile-breakpoint runs report no horizontal overflow or header collision.

## Stop and preserve evidence if

- any factor label overlaps the log-scale track or extends beyond its card;
- the top-row badge and language switch overlap or overflow the viewport;
- switching language changes or clears entered values, factors, or coverage;
- English and Chinese appear mixed within the same completed result;
- the page makes an unexpected network request or asks for login;
- a result says full coverage while a visible concentration gap remains;
- a volume is negative, `NaN`, or infinite;
- the page claims assay validation, biological suitability, or a vendor-recommended dilution.

For a stop condition, record the device/browser, selected language, exact input values, and one screenshot.
