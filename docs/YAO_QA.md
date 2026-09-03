# Yao real-device QA — v0.2

Use the new self-contained `elisa-pilot-dilution-planner.html` artifact. No account or network connection is required.

## Focused iPhone pass

1. Open the file, leave the example values unchanged, and tap **Build pilot plan**. Confirm the four factors remain near `1 / 19.9211 / 396.8503 / 7905.6942` with 100% coverage.
2. In **Log-scale view**, confirm every factor—including `396.8503×` and `7,905.6942×`—appears on its own line above the track and is fully readable.
3. While the result is still visible, switch from **EN** to **繁中**. Confirm the entered numbers and calculated factors stay unchanged while the static page, result cards, warnings, footer, page title, and accessibility labels change to Traditional Chinese.
4. Turn on the bench-friendly factor switch. Confirm the factors become `1 / 20 / 500 / 10000`, coverage remains continuous, and the Chinese result text remains complete.
5. Switch to **固定倍比**, use start `1`, fold `10`, and four points. Confirm factors are `1 / 10 / 100 / 1000` and the interface describes the set as the user's chosen series rather than an optimal recommendation.

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
