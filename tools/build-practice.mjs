import { readFile, writeFile } from "node:fs/promises";
import { syncNotices } from "./sync-legal-notices.mjs";
const root = new URL("../", import.meta.url);
const read = path => readFile(new URL(path, root), "utf8");
const [template, css, model, app, license, disclaimer] = await Promise.all([
  read("practice/template.html"), read("practice/styles.css"), read("practice/model.mjs"), read("practice/app.js"), read("LICENSE"), read("DISCLAIMER.md"),
]);
const script = '"use strict";\n(() => {\n' + model.replace(/^export /gm, "") + "\n" + app + "\n})();";
if (/<\/script/i.test(script) || /<\/style/i.test(css)) throw new Error("Unsafe inline closing tag in practice source.");
const output = syncNotices(template.replace("/* PRACTICE_STYLE */", css).replace("/* PRACTICE_SCRIPT */", () => script), license, disclaimer);
if (process.argv[2] === "--check") {
  if (await read("tools/practice.html") !== output) throw new Error("Practice HTML is stale. Run node tools/build-practice.mjs.");
  console.log("Standalone practice matches its source and notices.");
} else if (process.argv.length === 2) {
  await writeFile(new URL("tools/practice.html", root), output);
  console.log("Built the standalone offline practice.");
} else throw new Error("Use --check, or no arguments to build.");
