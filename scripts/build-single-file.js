"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const stylePath = path.join(root, "styles.css");
const plannerPath = path.join(root, "src", "planner.js");
const i18nPath = path.join(root, "src", "i18n.js");
const appPath = path.join(root, "src", "app.js");
const distPath = path.join(root, "dist");
const offlineOutputPath = path.join(distPath, "elisa-pilot-dilution-planner.html");
const rootOutputPath = path.join(distPath, "index.html");
const chineseOutputPath = path.join(distPath, "zh-tw", "index.html");

let html = fs.readFileSync(indexPath, "utf8");
const styles = fs.readFileSync(stylePath, "utf8");
const planner = fs.readFileSync(plannerPath, "utf8");
const i18n = fs.readFileSync(i18nPath, "utf8");
const app = fs.readFileSync(appPath, "utf8");

html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${styles}\n</style>`);
html = html.replace('<script src="src/planner.js"></script>', `<script>\n${planner}\n</script>`);
html = html.replace('<script src="src/i18n.js"></script>', `<script>\n${i18n}\n</script>`);
html = html.replace('<script src="src/app.js"></script>', `<script>\n${app}\n</script>`);

if (/\b(?:href|src)="(?:styles\.css|src\/)/.test(html)) {
  throw new Error("The single-file build still contains a local source dependency.");
}

const chineseHtml = html.replace(
  '<html lang="en" data-default-language="auto">',
  '<html lang="zh-Hant" data-default-language="zh-Hant">',
);

fs.mkdirSync(path.dirname(chineseOutputPath), { recursive: true });
fs.writeFileSync(offlineOutputPath, html, "utf8");
fs.writeFileSync(rootOutputPath, html, "utf8");
fs.writeFileSync(chineseOutputPath, chineseHtml, "utf8");
process.stdout.write(`${offlineOutputPath}\n${rootOutputPath}\n${chineseOutputPath}\n`);
