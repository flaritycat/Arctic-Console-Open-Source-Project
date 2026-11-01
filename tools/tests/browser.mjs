import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { makeRecord, blankState } from "../../practice/model.mjs";

const output = resolve("test-results");
await mkdir(output, { recursive: true });
const url = process.env.PRACTICE_URL || pathToFileURL(resolve("tools/practice.html")).href;
const browser = await chromium.launch();
const assessment = {
  decision: "investigate", finding: "The sample mean rose from 40% to 60%.",
  limitation: "Different locations were sampled, so we cannot claim a whole-bay increase.",
  next_check: "Revisit the same locations and check coverage and uncertainty.",
};
let passed = 0;
async function session(name, run, width = 1100) {
  const context = await browser.newContext({ offline: !process.env.PRACTICE_URL, viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [], requests = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("request", r => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
  try {
    await page.goto(url);
    await run(page, context);
    assert.deepEqual(errors, []);
    if (!process.env.PRACTICE_URL) assert.deepEqual(requests, []);
    passed++; console.log("PASS " + name);
  } finally { await context.close(); }
}
async function assertFits(page) {
  const overflow = await page.evaluate(() => {
    if (document.documentElement.scrollWidth <= innerWidth) return [];
    return Array.from(document.querySelectorAll("body *"))
      .filter(e => e.getBoundingClientRect().right > innerWidth)
      .slice(0, 10).map(e => ({ tag: e.tagName, id: e.id, class: e.className, right: e.getBoundingClientRect().right }));
  });
  assert.deepEqual(overflow, [], "Visible content must fit the viewport: " + JSON.stringify(overflow));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Page reflows without horizontal scrolling");
}
async function evidence(page) {
  await page.getByRole("button", { name: "Open the alert", exact: true }).click();
  for (const [summary, button] of [["Read the observation table", "Mark observations reviewed"], ["Read the sampling note", "Mark sampling note reviewed"]]) {
    await page.getByText(summary, { exact: true }).click();
    await page.getByRole("button", { name: button, exact: true }).click();
  }
  await page.getByRole("button", { name: "Write an assessment", exact: true }).click();
}
async function fill(page, values = assessment) {
  for (const [key, value] of Object.entries(values)) {
    if (key === "decision") await page.locator("#decision").selectOption(value);
    else await page.locator("#" + key).fill(value);
  }
}
async function downloaded(page, button) {
  const wait = page.waitForEvent("download");
  await page.getByRole("button", { name: button, exact: true }).click();
  const result = await wait;
  return JSON.parse(await readFile(await result.path(), "utf8"));
}
const file = (record, name = "practice.json") => ({ name, mimeType: "application/json", buffer: Buffer.from(JSON.stringify(record)) });
let handover, draft;
try {
  await session("author: evidence gate, validation, draft, handover and no false delivery", async page => {
    assert.equal(await page.locator('[data-step="2"]').isDisabled(), true);
    await page.getByRole("button", { name: "Open the alert", exact: true }).click();
    await page.getByRole("button", { name: "Write an assessment", exact: true }).click();
    assert.match(await page.locator("#error").textContent(), /both sources/);
    await page.locator('[data-step="0"]').click();
    await evidence(page);
    await page.getByRole("button", { name: "Review the handover", exact: true }).click();
    assert.equal(await page.locator("#decision").getAttribute("aria-invalid"), "true");
    assert.equal(await page.locator("#decision").evaluate(e => e === document.activeElement), true);
    await fill(page);
    draft = await downloaded(page, "Download draft");
    assert.equal(draft.payload.kind, "draft");
    await page.getByRole("button", { name: "Review the handover", exact: true }).click();
    assert.ok((await page.locator("#author-summary").textContent()).includes(assessment.limitation));
    handover = await downloaded(page, "Download handover");
    assert.equal(handover.payload.kind, "handover");
    assert.equal(handover.payload.training, true);
    assert.match(await page.locator("#handover-ready").textContent(), /No one has received or accepted/);
    await page.screenshot({ path: resolve(output, "practice-handover.png"), fullPage: true });
  });
  await session("fresh reader: inspect sources, reject wrong/changed files, complete local review", async page => {
    await page.getByRole("button", { name: "Review a handover", exact: true }).click();
    await page.locator("#handover-file").setInputFiles(file(handover));
    await page.locator("#reader-result").waitFor({ state: "visible" });
    assert.ok((await page.locator("#reader-summary").textContent()).includes(assessment.finding));
    await page.getByText("Sampling note", { exact: true }).click();
    assert.match(await page.locator("#reader-sampling").textContent(), /None of the first day's locations/);
    await page.getByRole("button", { name: "Finish reader practice", exact: true }).click();
    assert.match(await page.locator("#error").textContent(), /tick/);
    await page.locator("#reader-reviewed").check();
    await page.getByRole("button", { name: "Finish reader practice", exact: true }).click();
    assert.match(await page.locator("#reader-finished").textContent(), /does not notify/);
    await page.locator("#handover-file").setInputFiles(file(draft));
    await page.locator("#error").waitFor({ state: "visible" });
    assert.match(await page.locator("#error").textContent(), /draft/);
    const changed = structuredClone(handover); changed.payload.state.assessment.finding = "altered";
    await page.locator("#handover-file").setInputFiles(file(changed));
    await page.waitForFunction(() => document.getElementById("error").textContent.includes("checksum"));
    assert.ok((await page.locator("#reader-summary").textContent()).includes(assessment.finding));
  });
  await session("draft resume and cancelled replacement preserve authored work", async page => {
    await page.getByText("Resume a draft", { exact: true }).click();
    await page.locator("#draft-file").setInputFiles(file(draft));
    await page.locator("#finding").waitFor({ state: "visible" });
    assert.equal(await page.locator("#finding").inputValue(), assessment.finding);
    await page.locator("#finding").fill("My newer draft");
    await page.locator('[data-step="0"]').click();
    const empty = await makeRecord("draft", blankState());
    page.once("dialog", dialog => dialog.dismiss());
    await page.locator("#draft-file").setInputFiles(file(empty));
    await page.waitForFunction(() => document.getElementById("message").textContent.includes("cancelled"));
    await page.locator('[data-step="2"]').click();
    assert.equal(await page.locator("#finding").inputValue(), "My newer draft");
    page.once("dialog", dialog => dialog.dismiss());
    await page.getByRole("button", { name: "Start over", exact: true }).click();
    assert.equal(await page.locator("#finding").inputValue(), "My newer draft");
  });
  await session("import failures and navigation during a delayed read do not replace work", async page => {
    await evidence(page); await fill(page);
    await page.locator('[data-step="0"]').click();
    await page.getByText("Resume a draft", { exact: true }).click();
    await page.locator("#draft-file").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{") });
    await page.locator("#error").waitFor({ state: "visible" });
    assert.match(await page.locator("#error").textContent(), /readable JSON/);
    await page.locator("#draft-file").setInputFiles({ name: "huge.json", mimeType: "application/json", buffer: Buffer.alloc(65537) });
    await page.waitForFunction(() => document.getElementById("error").textContent.includes("64 KiB"));
    await page.evaluate(() => { File.prototype.text = function () { return new Promise(resolve => { window.finishFileRead = resolve; }); }; });
    await page.locator("#draft-file").setInputFiles(file(draft));
    await page.locator('[data-step="2"]').click();
    await page.locator("#finding").fill("Work changed after starting import");
    await page.evaluate(text => window.finishFileRead(text), JSON.stringify(draft));
    await page.waitForTimeout(100);
    assert.equal(await page.locator("#finding").inputValue(), "Work changed after starting import");
  });
  await session("untrusted imported markup is displayed as text", async page => {
    const malicious = structuredClone(draft.payload.state);
    malicious.assessment.finding = '<img src=x onerror="window.injected=1">';
    const record = await makeRecord("handover", malicious);
    await page.getByRole("button", { name: "Review a handover", exact: true }).click();
    await page.locator("#handover-file").setInputFiles(file(record));
    await page.locator("#reader-result").waitFor({ state: "visible" });
    assert.ok((await page.locator("#reader-summary").textContent()).includes("<img"));
    assert.equal(await page.locator("#reader-summary img").count(), 0);
    assert.equal(await page.evaluate(() => window.injected), undefined);
  });
  for (const width of [320, 390, 1280]) await session("responsive and keyboard sequence at " + width, async page => {
    await page.screenshot({ path: resolve(output, "practice-start-" + width + ".png"), fullPage: true });
    await assertFits(page);
    await evidence(page);
    await page.locator("#decision").focus();
    for (const expected of ["finding", "limitation", "next_check"]) {
      await page.keyboard.press("Tab");
      assert.equal(await page.locator("#" + expected).evaluate(e => e === document.activeElement), true);
    }
    await fill(page);
    if (width === 1280) await page.addStyleTag({ content: "html { font-size:200% }" });
    await assertFits(page);
    await page.screenshot({ path: resolve(output, "practice-assessment-" + width + ".png"), fullPage: true });
  }, width);
  console.log(passed + " browser scenarios passed.");
} finally { await browser.close(); }
