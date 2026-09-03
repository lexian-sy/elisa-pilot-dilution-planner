# Yao real-device QA — v0.2

Use the new self-contained `elisa-pilot-dilution-planner.html` artifact. No account or network connection is required.

On iPhone, use **Share → Save to Files** from the preview. The preview's own **Download** command has been observed returning to the preview without reliably saving the file.

## Accepted on iPhone

- 2026-09-03, Edge external-file view: default English result shows 100% coverage and the expected four factors.
- `396.8503×` and `7,905.6942×` are fully readable above their tracks.
- No horizontal overflow or result-card clipping is visible from the coverage summary through the footer.

## Focused iPhone pass

1. While the accepted default result is still visible, switch from **EN** to **繁中**. Confirm the entered numbers and calculated factors stay unchanged while the static page, result cards, warnings, footer, page title, and accessibility labels change to Traditional Chinese.
2. Turn on the bench-friendly factor switch. Confirm the factors become `1 / 20 / 500 / 10000`, coverage remains continuous, and the Chinese result text remains complete.
3. Switch to **固定倍比**, use start `1`, fold `10`, and four points. Confirm factors are `1 / 10 / 100 / 1000` and the interface describes the set as the user's chosen series rather than an optimal recommendation.

## Short desktop pass

1. Switch between **EN** and **繁中** at the top. Confirm neither language overlaps the prototype badge or header copy.
2. Empty one required field and calculate in each language. Confirm the error summary links to the field, the message follows the selected language, and no stale result remains.
3. Enter usable range `10–100`, known expected range `1–5`, and calculate. Confirm the tool stops and explains in the selected language that dilution cannot bring the range upward.

## Stop and preserve evidence if

- any factor label overlaps the log-scale track or extends beyond its card;
- switching language changes or clears entered values, factors, or coverage;
- English and Chinese appear mixed within the same completed result;
- the page makes a network request or asks for login;
- a result says full coverage while a visible concentration gap remains;
- a volume is negative, `NaN`, or infinite;
- the page claims assay validation, biological suitability, or a vendor-recommended dilution.

For a stop condition, record the device/browser, selected language, exact input values, and one screenshot.
