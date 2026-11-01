import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(root, "third_party/actions.json"), "utf8"));
const approved = new Set(registry.actions.map(item => item.repository + "@" + item.commit));
for (const item of registry.actions) {
  if (!/^[a-f0-9]{40}$/.test(item.commit) || item.license_url !== "https://github.com/" + item.repository + "/blob/" + item.commit + "/LICENSE")
    throw new Error("Action needs an exact source and license link: " + item.repository);
}
let count = 0;
for (const filename of await readdir(join(root, ".github/workflows"))) {
  if (!/\.ya?ml$/.test(filename)) continue;
  const content = await readFile(join(root, ".github/workflows", filename), "utf8");
  for (const [, action] of content.matchAll(/\buses:\s*([^\s#]+)/g)) {
    if (action.startsWith("./")) continue;
    if (!approved.has(action)) throw new Error(filename + ": unregistered or unpinned action " + action);
    count++;
  }
}
let assets;
try { assets = JSON.parse(await readFile(join(root, "third_party/vendored-files.json"), "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; }
for (const file of assets?.files || []) {
  const bytes = await readFile(join(root, file.path));
  if (createHash("sha256").update(bytes).digest("hex") !== file.sha256)
    throw new Error("Vendored file changed; review its upstream notice: " + file.path);
  if (!file.license || !file.upstream) throw new Error("Missing provenance: " + file.path);
  if (file.license_file) await readFile(join(root, file.license_file));
}
console.log(count + " workflow action references and " + (assets?.files.length || 0) + " vendored file hashes verified.");
