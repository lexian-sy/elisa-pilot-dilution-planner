# Yao real-device QA — v0.1

Use the self-contained `elisa-pilot-dilution-planner.html` artifact. No account or network connection is required.

## iPhone and desktop pass

1. Open the file. Confirm the page has no horizontal scrolling and text remains readable without zooming.
2. Leave the example values unchanged and tap **Build pilot plan**. Confirm it shows continuous coverage, four points near `1 / 19.9211 / 396.8503 / 7905.6942`, and an optional simplified `1 / 20 / 500 / 10000` set.
3. Turn on the bench-friendly factor switch. Confirm the coverage stays continuous and the liquid rows change to the simplified factors.
4. Switch to **Fixed-fold**, use start `1`, fold `10`, and four points. Confirm factors are `1 / 10 / 100 / 1000` and the page calls this an evaluated user series, not an optimal recommendation.
5. Enter usable range `10–100`, known expected range `1–5`, and calculate. Confirm the tool stops and says dilution cannot bring this range upward.
6. Empty one required field and calculate. Confirm the error summary links to the field and no stale result remains.
7. Confirm the 1:10,000 example row warns that an intermediate dilution is required when direct original-sample volume is below `2 µL`.

## Stop and preserve evidence if

- the page makes any network request or asks for login;
- a result says full coverage while a visible concentration gap remains;
- a volume is negative, `NaN`, or infinite;
- the iPhone view has horizontal overflow, clipped controls, or an unreachable button;
- changing modes leaves hidden fields active or produces factors from the wrong mode;
- the page claims assay validation, biological suitability, or a vendor-recommended dilution.

Record the device/browser, the exact input values, and a screenshot for any stop condition.
