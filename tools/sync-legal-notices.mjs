import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";

const start = "<!-- BEGIN EMBEDDED LEGAL NOTICES -->";
const end = "<!-- END EMBEDDED LEGAL NOTICES -->";
const escapeHtml = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function renderNotices(license, disclaimer) {
  return [
    start,
    '<details id="legal-notices">',
    '<summary>License and AI notice (available offline)</summary>',
    '<p>These texts travel with this file. The AI notice explains the license; it adds no license conditions.</p>',
    '<details><summary>Apache License 2.0 — complete text</summary>',
    '<pre id="license-text">' + escapeHtml(license.replaceAll("\r\n", "\n")) + '</pre>',
    '</details>',
    '<details><summary>AI development, warranty and liability notice</summary>',
    '<pre id="ai-notice-text">' + escapeHtml(disclaimer.replaceAll("\r\n", "\n")) + '</pre>',
    '</details></details>',
    end,
  ].join("\n");
}

export function syncNotices(html, license, disclaimer) {
  if (html.split(start).length !== 2 || html.split(end).length !== 2 || html.indexOf(start) > html.indexOf(end)) {
    throw new Error("Expected exactly one ordered pair of embedded legal notice markers.");
  }
  return html.slice(0, html.indexOf(start)) + renderNotices(license, disclaimer) + html.slice(html.indexOf(end) + end.length);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const mode = process.argv[2];
  if (!["--check", "--write"].includes(mode)) throw new Error("Use --check or --write.");
  const root = new URL("../", import.meta.url);
  const htmlPath = new URL("tools/evidence-check.html", root);
  const [html, license, disclaimer] = await Promise.all([
    readFile(htmlPath, "utf8"), readFile(new URL("LICENSE", root), "utf8"), readFile(new URL("DISCLAIMER.md", root), "utf8"),
  ]);
  const expected = syncNotices(html, license, disclaimer);
  if (mode === "--write") {
    await writeFile(htmlPath, expected);
    console.log("Updated embedded license and AI notice in " + fileURLToPath(htmlPath));
  } else if (html !== expected) {
    throw new Error("Embedded legal notices are missing or stale. Run node tools/sync-legal-notices.mjs --write.");
  } else {
    console.log("Standalone HTML contains the complete current license and AI notice.");
  }
}
