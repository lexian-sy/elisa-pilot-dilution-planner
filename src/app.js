(function startApp() {
  "use strict";

  const planner = window.ELISAPlanner;
  const form = document.querySelector("#planner-form");
  const results = document.querySelector("#results");
  const errorSummary = document.querySelector("#error-summary");
  const lowerUnknown = document.querySelector("#lowerUnknown");
  const expectedLowerWrap = document.querySelector("#expected-lower-wrap");
  const expectedSeparator = document.querySelector("#expected-separator");
  const fixedFields = document.querySelector("#fixed-fields");
  const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));

  let latestInput = null;
  let latestPlan = null;
  let useRounded = false;

  function numberValue(id) {
    const value = document.querySelector(`#${id}`).value.trim();
    return value === "" ? Number.NaN : Number(value);
  }

  function readInput() {
    return {
      mode: document.querySelector('input[name="mode"]:checked').value,
      assayLower: numberValue("assayLower"),
      assayUpper: numberValue("assayUpper"),
      expectedLower: numberValue("expectedLower"),
      expectedUpper: numberValue("expectedUpper"),
      lowerUnknown: lowerUnknown.checked,
      points: numberValue("points"),
      sampleVolume: numberValue("sampleVolume"),
      replicates: numberValue("replicates"),
      overage: numberValue("overage"),
      minimumPipette: numberValue("minimumPipette"),
      startFactor: numberValue("startFactor"),
      fold: numberValue("fold"),
      unit: document.querySelector("#unit").value.trim(),
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatNumber(value, maximumFractionDigits = 4) {
    const absolute = Math.abs(value);
    if (absolute !== 0 && (absolute >= 1e7 || absolute < 0.001)) {
      return value.toExponential(3).replace("e+", "e");
    }
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits,
      useGrouping: true,
    }).format(value);
  }

  function factorLabel(factor) {
    if (Math.abs(factor - 1) < 1e-9) return "1× (undiluted)";
    return `${formatNumber(factor)}× (1:${formatNumber(factor)})`;
  }

  function clearErrors() {
    errorSummary.hidden = true;
    errorSummary.innerHTML = "";
    document.querySelectorAll(".field-error").forEach((node) => node.remove());
    document.querySelectorAll("[aria-invalid='true']").forEach((node) => {
      node.removeAttribute("aria-invalid");
      node.removeAttribute("aria-describedby");
    });
  }

  function showErrors(errors) {
    clearErrors();
    const items = errors
      .map((error) => `<li><a href="#${escapeHtml(error.field)}">${escapeHtml(error.message)}</a></li>`)
      .join("");
    errorSummary.innerHTML = `<strong>Check ${errors.length === 1 ? "this field" : "these fields"}:</strong><ul>${items}</ul>`;
    errorSummary.hidden = false;

    const seen = new Set();
    for (const error of errors) {
      if (seen.has(error.field)) continue;
      seen.add(error.field);
      const field = document.querySelector(`#${CSS.escape(error.field)}`);
      if (!field) continue;
      const id = `${error.field}-error`;
      const message = document.createElement("p");
      message.className = "field-error";
      message.id = id;
      message.textContent = error.message;
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", id);
      field.closest(".field")?.appendChild(message);
    }
    errorSummary.focus();
  }

  function chartStyle(lower, upper, targetLower, targetUpper) {
    if (targetLower === targetUpper) {
      const includes = lower <= targetLower && upper >= targetUpper;
      return includes ? "left: 0%; width: 100%;" : "left: 0%; width: 0%;";
    }
    const logStart = Math.log(targetLower);
    const logSpan = Math.log(targetUpper) - logStart;
    const clippedLower = Math.max(targetLower, lower);
    const clippedUpper = Math.min(targetUpper, upper);
    if (clippedUpper <= clippedLower) return "left: 0%; width: 0%;";
    const left = ((Math.log(clippedLower) - logStart) / logSpan) * 100;
    const right = ((Math.log(clippedUpper) - logStart) / logSpan) * 100;
    return `left: ${left}%; width: ${Math.max(0, right - left)}%;`;
  }

  function renderCoverageMap(planSet, input) {
    const coverage = planSet.coverage;
    const unit = escapeHtml(input.unit);
    const rows = coverage.bands.map((band, index) => `
      <div class="coverage-row">
        <div class="coverage-row-label">${escapeHtml(formatNumber(band.factor))}×</div>
        <div class="coverage-track" aria-hidden="true">
          <span class="coverage-band band-${(index % 4) + 1}" style="${chartStyle(
            band.lower,
            band.upper,
            coverage.targetLower,
            coverage.targetUpper,
          )}"></span>
        </div>
        <div class="coverage-row-value">${escapeHtml(formatNumber(band.lower))}–${escapeHtml(formatNumber(band.upper))} ${unit}</div>
      </div>
    `).join("");

    return `
      <section class="result-section" aria-labelledby="coverage-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Log-scale view</p>
            <h3 id="coverage-title">Expected-range coverage</h3>
          </div>
          <span class="coverage-percent">${formatNumber(coverage.coveragePercent, 1)}%</span>
        </div>
        <div class="coverage-axis">
          <span>${escapeHtml(formatNumber(coverage.targetLower))} ${unit}</span>
          <span>${escapeHtml(formatNumber(coverage.targetUpper))} ${unit}</span>
        </div>
        <div class="coverage-map">${rows}</div>
      </section>
    `;
  }

  function renderGaps(coverage, input) {
    if (coverage.full) {
      return `<p class="success-note">The selected points cover the entered expected range without log-scale gaps.</p>`;
    }
    const gaps = coverage.gaps.map((gap) =>
      `<li>${escapeHtml(formatNumber(gap.lower))}–${escapeHtml(formatNumber(gap.upper))} ${escapeHtml(input.unit)}</li>`,
    ).join("");
    return `
      <div class="warning-note">
        <strong>Uncovered concentration ${coverage.gaps.length === 1 ? "gap" : "gaps"}</strong>
        <ul>${gaps}</ul>
      </div>
    `;
  }

  function renderFactorTable(planSet, input) {
    const unit = escapeHtml(input.unit);
    const rows = planSet.liquid.rows.map((row, index) => `
      <article class="factor-row ${row.directPreparationReliable ? "" : "factor-warning"}">
        <div class="factor-index">${index + 1}</div>
        <div>
          <p class="factor-main">${escapeHtml(factorLabel(row.factor))}</p>
          <p class="factor-band">Covers ${escapeHtml(formatNumber(row.coverage.lower))}–${escapeHtml(formatNumber(row.coverage.upper))} ${unit} in the original sample</p>
        </div>
        <dl class="mix-grid">
          <div><dt>Original sample</dt><dd>${escapeHtml(formatNumber(row.originalSample))} µL</dd></div>
          <div><dt>Diluent</dt><dd>${escapeHtml(formatNumber(row.diluent))} µL</dd></div>
          <div><dt>Prepare</dt><dd>${escapeHtml(formatNumber(row.preparedVolume))} µL</dd></div>
        </dl>
        <div class="factor-status ${row.directPreparationReliable ? "status-ok" : "status-warn"}">
          ${row.directPreparationReliable ? "Direct prep clears minimum" : "Intermediate dilution required"}
        </div>
      </article>
    `).join("");
    return `<div class="factor-list">${rows}</div>`;
  }

  function renderPlan() {
    if (!latestPlan || !latestInput) return;
    if (latestPlan.status === "impossible") {
      results.innerHTML = `
        <section class="result-hero result-impossible" tabindex="-1">
          <p class="eyebrow">Pilot coverage plan</p>
          <h2>Dilution cannot solve this range mismatch</h2>
          <p>${escapeHtml(latestPlan.reason)}</p>
          <p>Check the concentration units, expected target-analyte estimate, and the usable range from the kit insert or validated method.</p>
        </section>
      `;
      results.hidden = false;
      results.querySelector(".result-hero")?.focus();
      return;
    }

    const planSet = useRounded && latestPlan.rounded ? latestPlan.rounded : latestPlan.raw;
    const coverage = planSet.coverage;
    const liquid = planSet.liquid;
    const statusClass = coverage.full ? "result-covered" : "result-gaps";
    const statusTitle = coverage.full ? "Coverage is continuous" : "Coverage gaps remain";
    const roundingControl = latestPlan.rounded ? `
      <div class="rounding-control">
        <label class="switch-line">
          <input id="use-rounded" type="checkbox" ${useRounded ? "checked" : ""}>
          <span>Use bench-friendly factors that preserve full coverage</span>
        </label>
        <p>Raw mathematical factors remain the source calculation. Simplified factors are shown only after a fresh gap check.</p>
      </div>
    ` : "";
    const pointNotice = !coverage.full && latestPlan.minimumPoints
      ? `<p class="point-notice">At least <strong>${latestPlan.minimumPoints} points</strong> are needed for gap-free centered coverage with this assay span.</p>`
      : "";
    const unknownNotice = latestPlan.lowerUnknown
      ? `<p class="info-note">Lower bound is unknown. Auto mode starts coverage at the assay lower bound; concentrations below it cannot be assessed from the entered information.</p>`
      : "";
    const unreachableNotice = latestPlan.unreachableLow
      ? `<p class="warning-note">Part of the entered expected range is below the usable assay lower bound. Dilution only lowers concentration, so that segment cannot be brought upward into range.</p>`
      : "";

    results.innerHTML = `
      <section class="result-hero ${statusClass}" tabindex="-1">
        <div>
          <p class="eyebrow">Pilot coverage plan</p>
          <h2>${statusTitle}</h2>
          <p>${latestInput.mode === "auto" ? "Auto mode uses a transparent log-scale centering heuristic." : "Fixed-fold mode evaluates the dilution series you specified."}</p>
        </div>
        <div class="hero-metric">
          <strong>${formatNumber(coverage.coveragePercent, 1)}%</strong>
          <span>log-range covered</span>
        </div>
      </section>
      ${roundingControl}
      ${unknownNotice}
      ${unreachableNotice}
      ${renderGaps(coverage, latestInput)}
      ${pointNotice}
      ${renderCoverageMap(planSet, latestInput)}
      <section class="result-section" aria-labelledby="plan-title">
        <p class="eyebrow">Direct-preparation check</p>
        <h3 id="plan-title">Dilution points and liquid volumes</h3>
        <p class="section-copy">Each point is independently prepared from the original sample. Volumes include ${escapeHtml(formatNumber(latestInput.overage))}% overage.</p>
        ${renderFactorTable(planSet, latestInput)}
      </section>
      <section class="budget-grid" aria-label="Pilot budget summary">
        <div><span>Plate wells</span><strong>${liquid.wells}</strong></div>
        <div><span>Diluted sample prepared</span><strong>${escapeHtml(formatNumber(liquid.preparedTotal))} µL</strong></div>
        <div><span>Original sample, direct-prep total</span><strong>${escapeHtml(formatNumber(liquid.originalSampleTotal))} µL</strong></div>
        <div><span>Intermediate-dilution warnings</span><strong>${liquid.warningCount}</strong></div>
      </section>
      <section class="boundary-card">
        <h3>What this result means</h3>
        <p>This calculator plans concentration coverage and liquid volumes. It does not validate matrix effects, dilutional linearity, recovery, hook effect, assay performance, or biological suitability.</p>
        <p>Follow the kit insert or your validated method when they specify sample handling or dilution.</p>
      </section>
    `;
    results.hidden = false;

    const roundedCheckbox = document.querySelector("#use-rounded");
    roundedCheckbox?.addEventListener("change", () => {
      useRounded = roundedCheckbox.checked;
      renderPlan();
    });
    results.querySelector(".result-hero")?.focus();
  }

  function syncConditionalFields() {
    expectedLowerWrap.hidden = lowerUnknown.checked;
    expectedSeparator.textContent = lowerUnknown.checked ? "up to" : "to";
    document.querySelector("#expectedLower").disabled = lowerUnknown.checked;
    const mode = document.querySelector('input[name="mode"]:checked').value;
    fixedFields.hidden = mode !== "fixed";
    fixedFields.querySelectorAll("input").forEach((field) => {
      field.disabled = mode !== "fixed";
    });
    document.querySelector("#mode-description").textContent = mode === "auto"
      ? "Centers pilot points across the expected range on a log scale, then reports any gaps."
      : "Evaluates your chosen starting factor and constant fold step without calling it optimal.";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    latestInput = readInput();
    latestPlan = planner.calculate(latestInput);
    useRounded = false;
    if (!latestPlan.ok) {
      results.hidden = true;
      showErrors(latestPlan.errors);
      return;
    }
    renderPlan();
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      clearErrors();
      syncConditionalFields();
      results.hidden = true;
      latestInput = null;
      latestPlan = null;
      useRounded = false;
    }, 0);
  });

  lowerUnknown.addEventListener("change", syncConditionalFields);
  modeInputs.forEach((input) => input.addEventListener("change", syncConditionalFields));
  syncConditionalFields();
})();
