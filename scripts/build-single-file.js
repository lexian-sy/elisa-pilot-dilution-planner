"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const stylePath = path.join(root, "styles.css");
const plannerPath = path.join(root, "src", "planner.js");
const appPath = path.join(root, "src", "app.js");
const outputPath = path.join(root, "dist", "elisa-pilot-dilution-planner.html");

let html = fs.readFileSync(indexPath, "utf8");
const styles = fs.readFileSync(stylePath, "utf8");
const planner = fs.readFileSync(plannerPath, "utf8");
const app = fs.readFileSync(appPath, "utf8");

html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${styles}\n</style>`);
html = html.replace('<script src="src/planner.js"></script>', `<script>\n${planner}\n</script>`);
html = html.replace('<script src="src/app.js"></script>', `<script>\n${app}\n</script>`);

if (/\b(?:href|src)="(?:styles\.css|src\/)/.test(html)) {
  throw new Error("The single-file build still contains a local source dependency.");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf8");
process.stdout.write(`${outputPath}\n`);
