import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const url = process.env.PRACTICE_URL || new URL("../practice.html", import.meta.url).href;
let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser?.close(); });
async function open(t, reader = false) {
  const context = await browser.newContext({ offline: url.startsWith("file:"), viewport: { width: 320, height: 800 } });
  t.after(() => context.close());
  const page = await context.newPage();
  const start = new URL(url);
  if (reader) start.searchParams.set("reader", "1");
  await page.goto(start.href);
  return page;
}
async function mark(page, source) {
  await page.locator("#source-" + source + " summary").press("Enter");
  await page.locator('[data-review="' + source + '"]').press("Enter");
}
test("correcting one field preserves the other warnings, the draft and keyboard focus", async t => {
  const page = await open(t);
  await page.locator("#start").press("Enter");
  await mark(page, "observations"); await mark(page, "sampling");
  await page.locator("#to-assessment").press("Enter");
  await page.locator("#assessment-form button[type=submit]").press("Enter");
  const marked = () => page.locator('#assessment-form [aria-invalid="true"]').evaluateAll(els => els.map(e => e.id));
  assert.deepEqual(await marked(), ["decision", "finding", "limitation", "next_check"]);
  await page.locator("#decision").selectOption("investigate");
  assert.deepEqual(await marked(), ["finding", "limitation", "next_check"]);
  await page.locator("#finding").focus(); await page.keyboard.type("The two sample means differ.");
  assert.equal(await page.locator("#finding").evaluate(e => e === document.activeElement), true);
  assert.deepEqual(await marked(), ["limitation", "next_check"]);
  await page.locator("#limitation").fill("  ");
  assert.equal(await page.locator("#limitation-error").isVisible(), true);
  await page.locator("#limitation").fill("The two days cover different locations.");
  await page.locator("#next_check").fill("Revisit the same locations.");
  assert.deepEqual(await marked(), []);
  assert.equal(await page.locator("#error").isVisible(), false);
  await page.locator("#assessment-form button[type=submit]").press("Enter");
  assert.match(await page.locator("#author-summary").innerText(), /two sample means differ/);
});
test("an early attempt to continue does not leave a stale error beside reviewed sources", async t => {
  const page = await open(t); await page.locator("#start").press("Enter");
  await page.locator("#to-assessment").press("Enter");
  assert.equal(await page.locator("#error").isVisible(), true);
  await mark(page, "observations"); await mark(page, "sampling");
  assert.match(await page.locator("#message").innerText(), /Both sources reviewed/);
  assert.equal(await page.locator("#error").isVisible(), false);
});
test("a reader can inspect a 0.2.0 handover with a long filename at phone width", async t => {
  const page = await open(t, true);
  const bytes = await readFile(new URL("../examples/northern-bay-review.json", import.meta.url));
  const filename = "NorthernBay".repeat(16) + ".json";
  await page.locator("#handover-file").setInputFiles({ name: filename, mimeType: "application/json", buffer: bytes });
  await page.locator("#reader-result").waitFor();
  assert.ok((await page.locator("#reader-created").innerText()).includes(filename));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Filename causes horizontal scrolling");
  assert.match(await page.locator("#reader-summary").innerText(), /whole bay/i);
});
