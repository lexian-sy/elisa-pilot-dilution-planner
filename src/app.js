(function startApp() {
  "use strict";

  const planner = window.ELISAPlanner;
  const i18n = window.ELISAI18N;
  const form = document.querySelector("#planner-form");
  const results = document.querySelector("#results");
  const errorSummary = document.querySelector("#error-summary");
  const lowerUnknown = document.querySelector("#lowerUnknown");
  const expectedLowerWrap = document.querySelector("#expected-lower-wrap");
  const expectedSeparator = document.querySelector("#expected-separator");
  const fixedFields = document.querySelector("#fixed-fields");
  const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));
  const languageButtons = Array.from(document.querySelectorAll("[data-language]"));
  const languageStorageKey = "elisa-pilot-dilution-planner.language";

  let currentLanguage = "en";
  let latestInput = null;
  let latestPlan = null;
  let latestErrors = null;
  let useRounded = false;

  function t(key, values) {
    return i18n.translate(currentLanguage, key, values);
  }

  function initialLanguage() {
    const routeLanguage = document.documentElement.dataset.defaultLanguage;
    if (i18n.supportedLanguages.includes(routeLanguage)) return routeLanguage;

    let storedLanguage = null;
    try {
      storedLanguage = window.localStorage.getItem(languageStorageKey);
    } catch {
      // Some file:// and privacy modes disable storage. Browser language still provides a safe fallback.
    }
    const browserLanguages = Array.isArray(window.navigator.languages)
      ? window.navigator.languages
      : [window.navigator.language];
    return i18n.resolveLanguage(storedLanguage, browserLanguages);
  }

  function rememberLanguage(language) {
    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Language persistence is optional; calculation remains fully local and usable without storage.
    }
  }

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
    return new Intl.NumberFormat(currentLanguage === "zh-Hant" ? "zh-TW" : "en-US", {
      maximumFractionDigits,
      useGrouping: true,
    }).format(value);
  }

  function factorLabel(factor) {
    if (Math.abs(factor - 1) < 1e-9) {
      return `1× (${t("factor.undiluted")})`;
    }
    return `${formatNumber(factor)}× (1:${formatNumber(factor)})`;
  }

  function errorText(error) {
    return error.code ? t(`error.${error.code}`) : error.message;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t("document.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("document.description"));
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
    });
    const guideLink = document.querySelector("[data-guide-link]");
    if (guideLink) {
      const guidePath = currentLanguage === "zh-Hant"
        ? "zh-tw/guides/choosing-elisa-pilot-dilutions/"
        : "guides/choosing-elisa-pilot-dilutions/";
      guideLink.setAttribute("href", window.location.protocol === "file:" ? guidePath : `/${guidePath}`);
    }
    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
    });
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

  function showErrors(errors, focusSummary = true) {
    clearErrors();
    const items = errors
      .map((error) => `<li><a href="#${escapeHtml(error.field)}">${escapeHtml(errorText(error))}</a></li>`)
      .join("");
    const summaryKey = errors.length === 1 ? "error.summary.one" : "error.summary.many";
    errorSummary.innerHTML = `<strong>${escapeHtml(t(summaryKey))}</strong><ul>${items}</ul>`;
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
      message.textContent = errorText(error);
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", id);
      field.closest(".field")?.appendChild(message);
    }
    if (focusSummary) errorSummary.focus();
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
            <p class="eyebrow">${escapeHtml(t("coverage.eyebrow"))}</p>
            <h3 id="coverage-title">${escapeHtml(t("coverage.title"))}</h3>
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
      return `<p class="success-note">${escapeHtml(t("gaps.success"))}</p>`;
    }
    const gaps = coverage.gaps.map((gap) =>
      `<li>${escapeHtml(formatNumber(gap.lower))}–${escapeHtml(formatNumber(gap.upper))} ${escapeHtml(input.unit)}</li>`,
    ).join("");
    const gapKey = coverage.gaps.length === 1 ? "gaps.one" : "gaps.many";
    return `
      <div class="warning-note">
        <strong>${escapeHtml(t(gapKey))}</strong>
        <ul>${gaps}</ul>
      </div>
    `;
  }

  function renderFactorTable(planSet, input) {
    const unit = input.unit;
    const rows = planSet.liquid.rows.map((row, index) => {
      const coverageText = t("factor.covers", {
        lower: formatNumber(row.coverage.lower),
        upper: formatNumber(row.coverage.upper),
        unit,
      });
      return `
        <article class="factor-row ${row.directPreparationReliable ? "" : "factor-warning"}">
          <div class="factor-index">${index + 1}</div>
          <div>
            <p class="factor-main">${escapeHtml(factorLabel(row.factor))}</p>
            <p class="factor-band">${escapeHtml(coverageText)}</p>
          </div>
          <dl class="mix-grid">
            <div><dt>${escapeHtml(t("factor.original"))}</dt><dd>${escapeHtml(formatNumber(row.originalSample))} µL</dd></div>
            <div><dt>${escapeHtml(t("factor.diluent"))}</dt><dd>${escapeHtml(formatNumber(row.diluent))} µL</dd></div>
            <div><dt>${escapeHtml(t("factor.prepare"))}</dt><dd>${escapeHtml(formatNumber(row.preparedVolume))} µL</dd></div>
          </dl>
          <div class="factor-status ${row.directPreparationReliable ? "status-ok" : "status-warn"}">
            ${escapeHtml(t(row.directPreparationReliable ? "factor.status.ok" : "factor.status.warn"))}
          </div>
        </article>
      `;
    }).join("");
    return `<div class="factor-list">${rows}</div>`;
  }

  function renderPlan(focusResult = true) {
    if (!latestPlan || !latestInput) return;
    if (latestPlan.status === "impossible") {
      results.innerHTML = `
        <section class="result-hero result-impossible" tabindex="-1">
          <p class="eyebrow">${escapeHtml(t("result.eyebrow"))}</p>
          <h2>${escapeHtml(t("result.impossible.title"))}</h2>
          <p>${escapeHtml(t("result.impossible.reason"))}</p>
          <p>${escapeHtml(t("result.impossible.check"))}</p>
        </section>
      `;
      results.hidden = false;
      if (focusResult) results.querySelector(".result-hero")?.focus();
      return;
    }

    const planSet = useRounded && latestPlan.rounded ? latestPlan.rounded : latestPlan.raw;
    const coverage = planSet.coverage;
    const liquid = planSet.liquid;
    const statusClass = coverage.full ? "result-covered" : "result-gaps";
    const statusTitle = t(coverage.full ? "result.covered" : "result.gaps");
    const roundingControl = latestPlan.rounded ? `
      <div class="rounding-control">
        <label class="switch-line">
          <input id="use-rounded" type="checkbox" ${useRounded ? "checked" : ""}>
          <span>${escapeHtml(t("rounding.label"))}</span>
        </label>
        <p>${escapeHtml(t("rounding.help"))}</p>
      </div>
    ` : "";
    const pointNotice = !coverage.full && latestPlan.minimumPoints
      ? `<p class="point-notice">${t("notice.minimumPoints", { count: latestPlan.minimumPoints })}</p>`
      : "";
    const unknownNotice = latestPlan.lowerUnknown
      ? `<p class="info-note">${escapeHtml(t("notice.unknownLower"))}</p>`
      : "";
    const unreachableNotice = latestPlan.unreachableLow
      ? `<p class="warning-note">${escapeHtml(t("notice.unreachableLow"))}</p>`
      : "";
    const modeDescription = t(latestInput.mode === "auto" ? "result.description.auto" : "result.description.fixed");
    const planCopy = t("plan.copy", { overage: formatNumber(latestInput.overage) });

    results.innerHTML = `
      <section class="result-hero ${statusClass}" tabindex="-1">
        <div>
          <p class="eyebrow">${escapeHtml(t("result.eyebrow"))}</p>
          <h2>${escapeHtml(statusTitle)}</h2>
          <p>${escapeHtml(modeDescription)}</p>
        </div>
        <div class="hero-metric">
          <strong>${formatNumber(coverage.coveragePercent, 1)}%</strong>
          <span>${escapeHtml(t("result.metric"))}</span>
        </div>
      </section>
      ${roundingControl}
      ${unknownNotice}
      ${unreachableNotice}
      ${renderGaps(coverage, latestInput)}
      ${pointNotice}
      ${renderCoverageMap(planSet, latestInput)}
      <section class="result-section" aria-labelledby="plan-title">
        <p class="eyebrow">${escapeHtml(t("plan.eyebrow"))}</p>
        <h3 id="plan-title">${escapeHtml(t("plan.title"))}</h3>
        <p class="section-copy">${escapeHtml(planCopy)}</p>
        ${renderFactorTable(planSet, latestInput)}
      </section>
      <section class="budget-grid" aria-label="${escapeHtml(t("summary.label"))}">
        <div><span>${escapeHtml(t("summary.wells"))}</span><strong>${liquid.wells}</strong></div>
        <div><span>${escapeHtml(t("summary.prepared"))}</span><strong>${escapeHtml(formatNumber(liquid.preparedTotal))} µL</strong></div>
        <div><span>${escapeHtml(t("summary.original"))}</span><strong>${escapeHtml(formatNumber(liquid.originalSampleTotal))} µL</strong></div>
        <div><span>${escapeHtml(t("summary.warnings"))}</span><strong>${liquid.warningCount}</strong></div>
      </section>
      <section class="boundary-card">
        <h3>${escapeHtml(t("boundary.title"))}</h3>
        <p>${escapeHtml(t("boundary.body"))}</p>
        <p>${escapeHtml(t("boundary.follow"))}</p>
      </section>
    `;
    results.hidden = false;

    const roundedCheckbox = document.querySelector("#use-rounded");
    roundedCheckbox?.addEventListener("change", () => {
      useRounded = roundedCheckbox.checked;
      renderPlan(false);
    });
    if (focusResult) results.querySelector(".result-hero")?.focus();
  }

  function syncConditionalFields() {
    expectedLowerWrap.hidden = lowerUnknown.checked;
    expectedSeparator.textContent = t(lowerUnknown.checked ? "separator.upTo" : "separator.to");
    document.querySelector("#expectedLower").disabled = lowerUnknown.checked;
    const mode = document.querySelector('input[name="mode"]:checked').value;
    fixedFields.hidden = mode !== "fixed";
    fixedFields.querySelectorAll("input").forEach((field) => {
      field.disabled = mode !== "fixed";
    });
    document.querySelector("#mode-description").textContent = t(
      mode === "auto" ? "mode.description.auto" : "mode.description.fixed",
    );
  }

  function setLanguage(language, persist = true) {
    if (!i18n.supportedLanguages.includes(language)) return;
    currentLanguage = language;
    if (persist) rememberLanguage(language);
    applyStaticTranslations();
    syncConditionalFields();
    if (latestErrors) showErrors(latestErrors, false);
    if (latestPlan?.ok) renderPlan(false);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    latestInput = readInput();
    latestPlan = planner.calculate(latestInput);
    latestErrors = latestPlan.ok ? null : latestPlan.errors;
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
      latestErrors = null;
      useRounded = false;
    }, 0);
  });

  lowerUnknown.addEventListener("change", syncConditionalFields);
  modeInputs.forEach((input) => input.addEventListener("change", syncConditionalFields));
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  setLanguage(initialLanguage(), false);
})();
