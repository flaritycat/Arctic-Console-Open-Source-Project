import assert from "node:assert/strict";
import test from "node:test";
import { blankState, assessmentErrors, validateState, makeRecord, parseRecord, canonical, sha256, MAX_FILE_BYTES } from "../../practice/model.mjs";

const complete = () => ({ reviewed: ["observations", "sampling"], assessment: {
  decision: "investigate", finding: "The two sample means are 40% and 60%.",
  limitation: "The locations differ, so this does not establish bay-wide change.",
  next_check: "Revisit the same locations and assess coverage and uncertainty.",
}});
const encode = JSON.stringify;
async function resign(record) { record.sha256 = await sha256(canonical(record.payload)); return record; }

test("a partial draft round-trips without pretending it is a completed handover", async () => {
  const state = blankState(); state.assessment.finding = "A work in progress";
  const record = await makeRecord("draft", state);
  assert.deepEqual((await parseRecord(encode(record), "draft")).payload.state, state);
  await assert.rejects(parseRecord(encode(record), "handover"), /draft/);
  await assert.rejects(makeRecord("handover", state), /incomplete/);
});
test("a complete handover preserves evidence references and an independent reader's exact assessment", async () => {
  const record = await makeRecord("handover", complete(), new Date("2026-11-01T12:00:00.000Z"));
  const imported = await parseRecord(encode(record), "handover");
  assert.deepEqual(imported.payload.state, complete());
  assert.equal(imported.payload.training, true);
  assert.equal(imported.payload.evidence.length, 2);
  assert.equal(imported.payload.created_at, "2026-11-01T12:00:00.000Z");
});
test("required fields and reviewed sources are checked independently", async () => {
  for (const key of ["decision", "finding", "limitation", "next_check"]) {
    const state = complete(); state.assessment[key] = key === "decision" ? "" : "   ";
    assert.ok(assessmentErrors(state)[key]);
    await assert.rejects(makeRecord("handover", state), /incomplete/);
  }
  const state = complete(); state.reviewed.pop();
  assert.ok(assessmentErrors(state).evidence);
});
test("editing a record without a matching checksum is rejected", async () => {
  const record = await makeRecord("handover", complete());
  record.payload.state.assessment.finding = "Changed after download";
  await assert.rejects(parseRecord(encode(record), "handover"), /checksum/);
});
test("an editor can recalculate an unkeyed checksum; it is deliberately not authentication", async () => {
  const record = await makeRecord("handover", complete());
  record.payload.state.assessment.finding = "The whole bay changed (an unsupported interpretation).";
  await resign(record);
  assert.equal((await parseRecord(encode(record), "handover")).payload.state.assessment.finding, record.payload.state.assessment.finding);
});
test("case, schema, training flag, tool edition and source references cannot be silently substituted", async () => {
  for (const [key, value] of [["case_id", "other"], ["case_revision", 2], ["schema_version", 2], ["training", false], ["tool_version", "99.0.0"]]) {
    const record = await makeRecord("handover", complete()); record.payload[key] = value;
    await resign(record);
    await assert.rejects(parseRecord(encode(record), "handover"), /edition/);
  }
  const record = await makeRecord("handover", complete());
  record.payload.evidence[0].sha256 = "0".repeat(64); await resign(record);
  await assert.rejects(parseRecord(encode(record), "handover"), /references/);
});
test("malformed, oversized, unexpected and invalid-date records fail", async () => {
  await assert.rejects(parseRecord("{", "draft"), /readable JSON/);
  await assert.rejects(parseRecord(" ".repeat(MAX_FILE_BYTES + 1), "draft"), /64 KiB/);
  const record = await makeRecord("draft", blankState());
  record.payload.created_at = "yesterday";
  await assert.rejects(parseRecord(encode(record), "draft"), /time/);
  record.payload.created_at = "2026-11-01T12:00:00.000Z";
  record.payload.extra = "unexpected";
  await assert.rejects(parseRecord(encode(record), "draft"), /structure/);
});
test("invalid evidence shapes, duplicate reviews and excessive note lengths are rejected", async () => {
  const state = complete(); state.reviewed = ["sampling", "sampling"];
  assert.throws(() => validateState(state), /review list/);
  state.reviewed = ["sampling", "observations"]; state.assessment.finding = "x".repeat(1201);
  assert.throws(() => validateState(state), /too long/);
  const record = await makeRecord("draft", blankState());
  record.payload.evidence = { toString: ["nested"] };
  await assert.rejects(parseRecord(encode(record), "draft"), /references/);
});
test("markup remains a plain assessment string", async () => {
  const state = complete(); state.assessment.finding = '<img src=x onerror="alert(1)">';
  const record = await makeRecord("handover", state);
  assert.equal((await parseRecord(encode(record), "handover")).payload.state.assessment.finding, state.assessment.finding);
});
test("a download snapshots the state before asynchronous hashing", async () => {
  const state = complete();
  const pending = makeRecord("handover", state);
  state.assessment.finding = "Changed while hashing";
  const record = await pending;
  assert.equal(record.payload.state.assessment.finding, complete().assessment.finding);
});
