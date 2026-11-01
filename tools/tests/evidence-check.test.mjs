import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const html = await readFile(new URL("../evidence-check.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sample = await readFile(new URL("../examples/sample-observation.txt", import.meta.url));
const reference = "6e6a178eaf3ff47416d5efffb5d8ac836f22d477d9b889b79fb920ca19a94857";

// Use the HTML's real element IDs and run its form handler with Node's Web Crypto.
function harness() {
  const elements = new Map();
  for (const [, id] of html.matchAll(/ id="([^"]+)"/g)) {
    elements.set(id, {
      addEventListener(type, listener) { this[type] = listener; },
      focus() { this.focused = true; },
      dataset: {},
    });
  }
  const get = id => elements.get(id);
  const blobs = [];
  const downloads = [];
  vm.runInNewContext(script, {
    document: {
      getElementById: get,
      createElement: () => ({ click() { downloads.push(this); } }),
    },
    crypto: webcrypto,
    Blob,
    URL: {
      createObjectURL(blob) { blobs.push(blob); return "blob:local-test"; },
      revokeObjectURL() {},
    },
    setTimeout(callback) { callback(); },
  });
  get("file").files = [new File([sample], "sample-observation.txt")];
  get("expected").value = reference;
  return { get, blobs, downloads, check: () => get("check").submit({ preventDefault() {} }) };
}

test("matches the published sample, including uppercase and surrounding whitespace", async () => {
  const { get, check } = harness();
  get("expected").value = " " + reference.toUpperCase() + " ";
  await check();
  assert.equal(get("result").dataset.kind, "match");
  assert.equal(get("actual").textContent, reference);
  get("expected").input();
  assert.equal(get("result").hidden, true);
});

test("detects a single changed byte and clears the verdict for a newly chosen file", async () => {
  const { get, check } = harness();
  const edited = Uint8Array.from(sample);
  edited[0] ^= 1;
  get("file").files = [new File([edited], "sample-observation.txt")];
  await check();
  assert.equal(get("result").dataset.kind, "mismatch");
  assert.notEqual(get("actual").textContent, reference);
  get("file").change();
  assert.equal(get("result").hidden, true);
});

test("rejects malformed fingerprints and oversized files before reading bytes", async () => {
  const { get, check } = harness();
  get("expected").value = "not a digest";
  await check();
  assert.equal(get("expected").focused, true);
  assert.equal(get("result").dataset.kind, "error");
  get("expected").value = reference;
  get("file").files = [{ size: 64 * 1024 * 1024 + 1 }];
  await check();
  assert.equal(get("title").textContent, "File exceeds 64 MiB");
});

test("changing the input while bytes are being read discards the earlier result", async () => {
  const { get, check } = harness();
  let finish;
  get("file").files = [{ size: 1, arrayBuffer: () => new Promise(resolve => { finish = resolve; }) }];
  const pending = check();
  get("expected").input();
  finish(new ArrayBuffer(1));
  await pending;
  assert.equal(get("result").hidden, true);
  assert.equal(get("compare").disabled, false);
});

test("checks empty files and recovers after a read failure", async () => {
  const { get, check } = harness();
  get("file").files = [new File([], "empty.txt")];
  get("expected").value = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  await check();
  assert.equal(get("result").dataset.kind, "match");
  get("file").files = [{ size: 0, arrayBuffer: async () => { throw Error("unreadable"); } }];
  await check();
  assert.equal(get("result").dataset.kind, "error");
  assert.equal(get("compare").disabled, false);
  get("file").files = [new File([], "empty.txt")];
  await check();
  assert.equal(get("result").dataset.kind, "match");
});

test("the in-page download contains exactly the published synthetic sample", () => {
  const encoded = html.match(/href="data:text\/plain;base64,([^"]+)"/)[1];
  assert.deepEqual(Buffer.from(encoded, "base64"), sample);
  assert.ok(html.includes(reference));
});

test("downloads a check record and prevents exporting it after the input changes", async () => {
  const { get, check, blobs, downloads } = harness();
  await check();
  assert.equal(get("save").hidden, false);
  get("save").click();
  assert.equal(downloads[0].download, "arctic-evidence-check.json");
  const record = JSON.parse(await blobs[0].text());
  assert.equal(record.schema_version, 1);
  assert.equal(record.tool_version, "0.2.1");
  assert.equal(record.recorded_sha256, reference);
  assert.equal(record.calculated_sha256, reference);
  assert.equal(record.file_size_bytes, sample.length);
  assert.equal(record.file_name, "sample-observation.txt");
  assert.equal(record.result, "match");
  assert.ok(Number.isFinite(Date.parse(record.checked_at)));
  get("expected").input();
  assert.equal(get("save").hidden, true);
  get("save").click();
  assert.equal(downloads.length, 1);
});

test("a mismatch record preserves both fingerprints and the mismatching outcome", async () => {
  const { get, check, blobs } = harness();
  get("expected").value = "0".repeat(64);
  await check();
  get("save").click();
  const record = JSON.parse(await blobs[0].text());
  assert.equal(record.result, "mismatch");
  assert.equal(record.recorded_sha256, "0".repeat(64));
  assert.equal(record.calculated_sha256, reference);
});
