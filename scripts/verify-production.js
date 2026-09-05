"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const origin = "https://elisa-planner.lexiansy.space";

const checks = [
  {
    route: "/",
    file: "dist/index.html",
    required: ["read the pilot dilution guide"],
  },
  {
    route: "/zh-tw/",
    file: "dist/zh-tw/index.html",
    required: ["閱讀預試稀釋指南"],
  },
  {
    route: "/guides/choosing-elisa-pilot-dilutions/",
    file: "dist/guides/choosing-elisa-pilot-dilutions/index.html",
    required: [
      "<title>Choosing ELISA Pilot Dilutions for Uncertain Samples</title>",
      `<link rel="canonical" href="${origin}/guides/choosing-elisa-pilot-dilutions/">`,
    ],
  },
  {
    route: "/zh-tw/guides/choosing-elisa-pilot-dilutions/",
    file: "dist/zh-tw/guides/choosing-elisa-pilot-dilutions/index.html",
    required: [
      "<title>樣本濃度不確定時的 ELISA 預試稀釋選擇指南</title>",
      `<link rel="canonical" href="${origin}/zh-tw/guides/choosing-elisa-pilot-dilutions/">`,
    ],
  },
  {
    route: "/sitemap.xml",
    file: "dist/sitemap.xml",
    required: [
      `<loc>${origin}/guides/choosing-elisa-pilot-dilutions/</loc>`,
      `<loc>${origin}/zh-tw/guides/choosing-elisa-pilot-dilutions/</loc>`,
    ],
  },
];

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function normalizeText(bytes) {
  return bytes.toString("utf8").replaceAll("\r\n", "\n");
}

async function main() {
  for (const check of checks) {
    const response = await fetch(`${origin}${check.route}`, {
      headers: { "cache-control": "no-cache" },
    });
    assert.equal(response.status, 200, `${check.route} returned ${response.status}`);

    const remote = Buffer.from(await response.arrayBuffer());
    const remoteText = remote.toString("utf8");
    const local = fs.readFileSync(path.join(root, check.file));
    for (const required of check.required) {
      assert.ok(remoteText.includes(required), `${check.route} is missing ${required}`);
    }
    assert.equal(normalizeText(remote), normalizeText(local), `${check.route} differs from ${check.file}`);
    process.stdout.write(`${check.route} 200 sha256=${sha256(remote)} content=verified\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
