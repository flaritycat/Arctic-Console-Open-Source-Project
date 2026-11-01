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
  vm.runInNewContext(script, { document: { getElementById: get }, crypto: webcrypto });
  get("file").files = [new File([sample], "sample-observation.txt")];
  get("expected").value = reference;
  return { get, check: () => get("check").submit({ preventDefault() {} }) };
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
