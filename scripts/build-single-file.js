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
const robotsOutputPath = path.join(distPath, "robots.txt");
const sitemapOutputPath = path.join(distPath, "sitemap.xml");
const productionOrigin = "https://elisa-pilot-dilution-planner.lexian.workers.dev";

let html = fs.readFileSync(indexPath, "utf8");
const styles = fs.readFileSync(stylePath, "utf8");
const planner = fs.readFileSync(plannerPath, "utf8");
const i18n = fs.readFileSync(i18nPath, "utf8");
const translations = require(i18nPath);
const app = fs.readFileSync(appPath, "utf8");

html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${styles}\n</style>`);
html = html.replace('<script src="src/planner.js"></script>', `<script>\n${planner}\n</script>`);
html = html.replace('<script src="src/i18n.js"></script>', `<script>\n${i18n}\n</script>`);
html = html.replace('<script src="src/app.js"></script>', `<script>\n${app}\n</script>`);

if (/\b(?:href|src)="(?:styles\.css|src\/)/.test(html)) {
  throw new Error("The single-file build still contains a local source dependency.");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function localizeStaticHtml(source, language) {
  let localized = source.replace(
    '<html lang="en" data-default-language="auto">',
    `<html lang="${language}" data-default-language="${language}">`,
  );
  localized = localized.replace(
    `<link rel="canonical" href="${productionOrigin}/">`,
    `<link rel="canonical" href="${productionOrigin}/zh-tw/">`,
  );
  localized = localized.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(translations.translate(language, "document.title"))}</title>`);
  localized = localized.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeHtml(translations.translate(language, "document.description"))}">`,
  );
  localized = localized.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(translations.translate(language, "document.title"))}">`);
  localized = localized.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(translations.translate(language, "document.description"))}">`);
  localized = localized.replace(`<meta property="og:url" content="${productionOrigin}/">`, `<meta property="og:url" content="${productionOrigin}/zh-tw/">`);
  localized = localized.replace('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="zh_TW">');
  localized = localized.replace('<meta property="og:locale:alternate" content="zh_TW">', '<meta property="og:locale:alternate" content="en_US">');
  localized = localized.replace(
    /(<([a-z][\w-]*)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/gi,
    (match, opening, tag, key, text, closing) => `${opening}${escapeHtml(translations.translate(language, key))}${closing}`,
  );
  localized = localized.replace(/<[^>]+data-i18n-aria-label="([^"]+)"[^>]*>/gi, (tag, key) =>
    tag.replace(/aria-label="[^"]*"/i, `aria-label="${escapeHtml(translations.translate(language, key))}"`),
  );
  localized = localized.replace(/data-language="en" aria-pressed="true"/, 'data-language="en" aria-pressed="false"');
  localized = localized.replace(/data-language="zh-Hant" aria-pressed="false"/, 'data-language="zh-Hant" aria-pressed="true"');
  return localized;
}

const chineseHtml = localizeStaticHtml(html, "zh-Hant");
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${productionOrigin}/sitemap.xml\n`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${productionOrigin}/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${productionOrigin}/" />
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="${productionOrigin}/zh-tw/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${productionOrigin}/" />
  </url>
  <url>
    <loc>${productionOrigin}/zh-tw/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${productionOrigin}/" />
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="${productionOrigin}/zh-tw/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${productionOrigin}/" />
  </url>
</urlset>
`;

fs.mkdirSync(path.dirname(chineseOutputPath), { recursive: true });
fs.writeFileSync(offlineOutputPath, html, "utf8");
fs.writeFileSync(rootOutputPath, html, "utf8");
fs.writeFileSync(chineseOutputPath, chineseHtml, "utf8");
fs.writeFileSync(robotsOutputPath, robots, "utf8");
fs.writeFileSync(sitemapOutputPath, sitemap, "utf8");
process.stdout.write(`${offlineOutputPath}\n${rootOutputPath}\n${chineseOutputPath}\n${robotsOutputPath}\n${sitemapOutputPath}\n`);
