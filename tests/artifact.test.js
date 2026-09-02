"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const builtHtml = fs.readFileSync(path.join(root, "dist", "elisa-pilot-dilution-planner.html"), "utf8");
const appJs = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

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
  assert.doesNotMatch(builtHtml, /<(?:script|link)\b[^>]+(?:src|href)="(?:src\/|styles\.css|https?:\/\/)/i);
  assert.doesNotMatch(builtHtml, /\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|EventSource)\b/);
  assert.doesNotMatch(builtHtml, /<script\b[^>]*type="module"/i);
  assert.match(builtHtml, /<style>[\s\S]+<\/style>/);
  assert.match(builtHtml, /window\.ELISAPlanner/);
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
  assert.doesNotMatch(css, /min-width:\s*(?:[4-9]\d{2}|\d{4,})px/);
});
