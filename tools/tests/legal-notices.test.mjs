import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { syncNotices, renderNotices } from "../sync-legal-notices.mjs";

const root = new URL("../../", import.meta.url);
const [html, license, disclaimer] = await Promise.all([
  readFile(new URL("tools/evidence-check.html", root), "utf8"),
  readFile(new URL("LICENSE", root), "utf8"),
  readFile(new URL("DISCLAIMER.md", root), "utf8"),
]);

test("the distributed single file carries both current legal texts in full", () => {
  assert.equal(html, syncNotices(html, license, disclaimer));
  const decode = text => text.replaceAll("&gt;", ">").replaceAll("&lt;", "<").replaceAll("&amp;", "&");
  assert.equal(decode(html.match(/<pre id="license-text">([\s\S]*?)<\/pre>/)[1]), license.replaceAll("\r\n", "\n"));
  assert.equal(decode(html.match(/<pre id="ai-notice-text">([\s\S]*?)<\/pre>/)[1]), disclaimer.replaceAll("\r\n", "\n"));
  assert.notEqual(html, syncNotices(html, license + "\nChanged terms", disclaimer));
});

test("embedded notices cannot inject markup or executable scripts", () => {
  const dangerous = '</pre><script>alert("x")</script>&';
  const rendered = renderNotices(dangerous, dangerous);
  assert.ok(rendered.includes("&lt;script&gt;"));
  assert.ok(!rendered.includes('<script>'));
  assert.equal((rendered.match(/<pre /g) || []).length, 2);
});

test("missing, duplicate or reversed notice markers fail instead of hiding a packaging error", () => {
  for (const broken of [
    "<html></html>",
    html + "<!-- BEGIN EMBEDDED LEGAL NOTICES -->",
    "<!-- END EMBEDDED LEGAL NOTICES --><!-- BEGIN EMBEDDED LEGAL NOTICES -->",
  ]) assert.throws(() => syncNotices(broken, license, disclaimer), /markers/);
});
