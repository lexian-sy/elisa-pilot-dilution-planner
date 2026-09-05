"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const builtHtml = fs.readFileSync(path.join(root, "dist", "elisa-pilot-dilution-planner.html"), "utf8");
const hostedHtml = fs.readFileSync(path.join(root, "dist", "index.html"), "utf8");
const hostedChineseHtml = fs.readFileSync(path.join(root, "dist", "zh-tw", "index.html"), "utf8");
const robots = fs.readFileSync(path.join(root, "dist", "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8");
const appJs = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
const plannerJs = fs.readFileSync(path.join(root, "src", "planner.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
const privacy = fs.readFileSync(path.join(root, "PRIVACY.md"), "utf8");
const i18n = require("../src/i18n.js");

test("source IDs are unique and every static app selector resolves", () => {
  const ids = Array.from(sourceHtml.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML contains duplicate IDs");

  const selectorIds = Array.from(appJs.matchAll(/querySelector\("#([^"${}]+)"\)/g), (match) => match[1]);
  const dynamicallyRenderedIds = new Set(["use-rounded"]);
  for (const id of selectorIds) {
    assert.ok(ids.includes(id) || dynamicallyRenderedIds.has(id), `Missing element for #${id}`);
  }
});

test("self-contained artifact has no external dependency or network primitive", () => {
  assert.doesNotMatch(builtHtml, /<script\b[^>]+src="(?:src\/|https?:\/\/)/i);
  assert.doesNotMatch(builtHtml, /<link\b[^>]+rel="stylesheet"[^>]+href="(?:styles\.css|https?:\/\/)/i);
  assert.doesNotMatch(builtHtml, /\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|EventSource)\b/);
  assert.doesNotMatch(builtHtml, /<script\b[^>]*type="module"/i);
  assert.match(builtHtml, /<style>[\s\S]+<\/style>/);
  assert.match(builtHtml, /window\.ELISAPlanner/);
});

test("hosted outputs preserve the accepted artifact and expose a Chinese route", () => {
  assert.equal(hostedHtml, builtHtml);
  assert.match(hostedHtml, /<html lang="en" data-default-language="auto">/);
  assert.match(hostedChineseHtml, /<html lang="zh-Hant" data-default-language="zh-Hant">/);
  assert.match(hostedChineseHtml, /<title>ELISA 初次稀釋規劃器<\/title>/);
  assert.match(hostedChineseHtml, />規劃涵蓋範圍<\/strong>/);
  assert.match(hostedChineseHtml, /data-language="zh-Hant" aria-pressed="true"/);
  assert.match(hostedChineseHtml, /window\.ELISAPlanner/);
  assert.doesNotMatch(hostedChineseHtml, /\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|EventSource)\b/);
});

test("hosted outputs publish canonical and alternate locale URLs", () => {
  const origin = "https://elisa-planner.lexiansy.space";
  assert.match(hostedHtml, new RegExp(`<link rel="canonical" href="${origin}/">`));
  assert.match(hostedChineseHtml, new RegExp(`<link rel="canonical" href="${origin}/zh-tw/">`));
  for (const output of [hostedHtml, hostedChineseHtml]) {
    assert.match(output, new RegExp(`hreflang="en" href="${origin}/">`));
    assert.match(output, new RegExp(`hreflang="zh-Hant" href="${origin}/zh-tw/">`));
    assert.match(output, new RegExp(`hreflang="x-default" href="${origin}/">`));
  }
});

test("public discovery files point only to the production locale URLs", () => {
  const origin = "https://elisa-planner.lexiansy.space";
  assert.match(robots, new RegExp(`Sitemap: ${origin}/sitemap\\.xml`));
  assert.match(sitemap, new RegExp(`<loc>${origin}/</loc>`));
  assert.match(sitemap, new RegExp(`<loc>${origin}/zh-tw/</loc>`));
  assert.match(sitemap, /hreflang="en"/);
  assert.match(sitemap, /hreflang="zh-Hant"/);
  assert.doesNotMatch(`${robots}\n${sitemap}`, /localhost|127\.0\.0\.1/);
});

test("artifact preserves required product and safety wording", () => {
  for (const phrase of [
    "Usable assay range",
    "Expected original target-analyte concentration",
    "Auto coverage",
    "Fixed-fold",
    "Minimum reliable pipetting volume",
    "Built by Lexian",
    "does not validate matrix effects",
  ]) {
    assert.match(builtHtml, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("mobile layout and accessibility scaffolding are present", () => {
  assert.match(sourceHtml, /name="viewport"[^>]+width=device-width/i);
  assert.match(sourceHtml, /<main>/i);
  assert.match(sourceHtml, /role="alert"/i);
  assert.match(sourceHtml, /aria-live="polite"/i);
  assert.match(sourceHtml, /class="skip-link"/i);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /\.coverage-row\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(css, /min-width:\s*(?:[4-9]\d{2}|\d{4,})px/);
});

test("mobile header separates the release badge from the right-aligned language switch", () => {
  const headerTools = sourceHtml.match(/<div class="header-tools">([\s\S]*?)<\/div>\s*<\/div>\s*<\/header>/)?.[1] || "";
  assert.ok(headerTools.indexOf("prototype-badge") < headerTools.indexOf("language-switch"));
  assert.match(css, /\.header-tools\s*\{[\s\S]*?right:\s*0;[\s\S]*?justify-content:\s*space-between;[\s\S]*?flex-wrap:\s*nowrap;/);
  assert.match(css, /\.language-switch button\s*\{[\s\S]*?min-width:\s*3rem;[\s\S]*?min-height:\s*2\.75rem;/);
});

test("mobile typography uses readable body, supporting, and detail size floors", () => {
  const mobileCss = css.slice(
    css.indexOf("@media (max-width: 620px)"),
    css.indexOf("@media (prefers-reduced-motion: reduce)"),
  );
  assert.match(css, /--mobile-reading-size:\s*1rem;/);
  assert.match(css, /--mobile-secondary-size:\s*0\.95rem;/);
  assert.match(css, /--mobile-detail-size:\s*0\.9rem;/);
  for (const match of mobileCss.matchAll(/font-size:\s*(\d*\.?\d+)rem/g)) {
    assert.ok(Number(match[1]) >= 0.9, `Mobile text is smaller than 0.9rem: ${match[0]}`);
  }
  for (const selector of [
    ".header-copy",
    ".intro-strip span",
    ".mode-description",
    ".field small",
    ".result-hero p",
    ".success-note",
    ".section-copy",
    ".coverage-row-value",
    ".factor-band",
    ".mix-grid dt",
    ".budget-grid span",
    ".boundary-card p",
    "footer span, footer p",
  ]) {
    assert.ok(css.includes(selector), `Missing mobile typography coverage for ${selector}`);
  }
});

test("English and Traditional Chinese expose the same translation keys", () => {
  const englishKeys = Object.keys(i18n.messages.en).sort();
  const chineseKeys = Object.keys(i18n.messages["zh-Hant"]).sort();
  assert.deepEqual(chineseKeys, englishKeys);

  const referencedKeys = [
    ...Array.from(sourceHtml.matchAll(/data-i18n="([^"]+)"/g), (match) => match[1]),
    ...Array.from(sourceHtml.matchAll(/data-i18n-aria-label="([^"]+)"/g), (match) => match[1]),
  ];
  for (const key of referencedKeys) {
    assert.ok(englishKeys.includes(key), `Missing translation key: ${key}`);
  }

  const dynamicKeys = Array.from(appJs.matchAll(/\bt\("([^"]+)"/g), (match) => match[1]);
  for (const key of dynamicKeys) {
    assert.ok(englishKeys.includes(key), `Missing dynamic translation key: ${key}`);
  }

  const errorCodes = Array.from(plannerJs.matchAll(/(?:add\("[^"]+",\s*"|code:\s*")([a-z_]+)"/g), (match) => match[1]);
  for (const code of errorCodes) {
    assert.ok(englishKeys.includes(`error.${code}`), `Missing error translation: ${code}`);
  }

  for (const language of i18n.supportedLanguages) {
    for (const key of englishKeys) {
      assert.ok(i18n.messages[language][key].trim().length > 0, `Blank ${language} translation: ${key}`);
    }
  }
  assert.doesNotMatch(i18n.messages["zh-Hant"]["mode.description.fixed"], /妳/);
});

test("language switch is local, accessible, and available in the built artifact", () => {
  assert.match(sourceHtml, /data-language="en"[^>]+aria-pressed="true"/);
  assert.match(sourceHtml, /data-language="zh-Hant"[^>]+aria-pressed="false"/);
  assert.match(appJs, /document\.documentElement\.lang\s*=\s*currentLanguage/);
  assert.match(appJs, /localStorage\.getItem\(languageStorageKey\)/);
  assert.match(appJs, /localStorage\.setItem\(languageStorageKey, language\)/);
  assert.doesNotMatch(appJs, /location\.(?:assign|replace)|window\.location\s*=/);
  assert.match(builtHtml, /window\.ELISAI18N/);
  assert.match(builtHtml, /ELISA 初次稀釋規劃器/);
});

test("language resolution respects a saved choice and otherwise follows Chinese browser locales", () => {
  assert.equal(i18n.resolveLanguage("zh-Hant", ["en-US"]), "zh-Hant");
  assert.equal(i18n.resolveLanguage("en", ["zh-TW"]), "en");
  assert.equal(i18n.resolveLanguage(null, ["zh-TW", "en-US"]), "zh-Hant");
  assert.equal(i18n.resolveLanguage("unsupported", ["zh_Hant"]), "zh-Hant");
  assert.equal(i18n.resolveLanguage(null, ["en-US"]), "en");
});

test("public beta carries its open-source and privacy boundaries", () => {
  assert.match(license, /^MIT License/m);
  assert.match(license, /Copyright \(c\) 2026 Lexian/);
  assert.match(privacy, /no account system, analytics, advertising, backend, database, cookies, or network request/i);
  assert.match(privacy, /language preference/i);
  assert.match(builtHtml, /Public beta · v0\.4\.1/);
});

test("support stays optional, external, localized, and separate from calculation", () => {
  const supportUrl = "https://buymeacoffee.com/lexian";
  for (const output of [builtHtml, hostedHtml, hostedChineseHtml]) {
    assert.match(output, new RegExp(`href="${supportUrl}"`));
    assert.match(output, /target="_blank" rel="noopener noreferrer"/);
    assert.doesNotMatch(output, /<iframe\b|buymeacoffee\.com\/widget/i);
  }
  assert.match(hostedHtml, />Support this tool<\/a>/);
  assert.match(hostedChineseHtml, />支持這個工具<\/a>/);
  assert.match(privacy, /does not send concentration inputs, results, or other application data/i);
});
