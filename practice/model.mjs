// Copyright 2026 Arctic Console contributors. SPDX-License-Identifier: Apache-2.0
export const VERSION = "0.2.0";
export const MAX_FILE_BYTES = 64 * 1024;
export const CASE = {
  id: "northern-bay-001", revision: 1, title: "Did the ice increase across the bay?",
  evidence: [
    { id: "observations", title: "Fictional observation table",
      text: "FICTIONAL TRAINING DATA — Northern Bay\n30 October 2026: point A 20%, point B 40%, point C 60%. Mean: 40%.\n31 October 2026: point D 50%, point E 70%. Mean: 60%.\nThese are different locations on the two days. No real Arctic observations are represented." },
    { id: "sampling", title: "Sampling note",
      text: "FICTIONAL TRAINING NOTE — Northern Bay\nNone of the first day's locations was revisited. There are only five readings, no bay-wide coverage and no uncertainty estimate. A change between these sample means does not establish a change at matched locations or across the whole bay." },
  ],
};
export const DECISIONS = {
  investigate: "Check further",
  monitor: "Keep under review",
  escalate: "Ask for specialist review",
};
export const blankState = () => ({ reviewed: [], assessment: { decision: "", finding: "", limitation: "", next_check: "" } });
export function assessmentErrors(state) {
  const errors = {};
  if (state.reviewed.length !== 2) errors.evidence = "Open and review both sources before preparing a handover.";
  if (!Object.hasOwn(DECISIONS, state.assessment.decision)) errors.decision = "Choose what should happen next.";
  for (const [key, label] of [["finding", "Write what the evidence supports."], ["limitation", "Explain what is still uncertain."], ["next_check", "Give the next analyst a specific check."]]) {
    if (!state.assessment[key].trim()) errors[key] = label;
  }
  return errors;
}
export function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + canonical(value[k])).join(",") + "}";
  return JSON.stringify(value);
}
export async function sha256(text) {
  if (!globalThis.crypto?.subtle) throw new Error("Secure hashing is unavailable. Use the hosted HTTPS page or a current browser with the downloaded file.");
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), v => v.toString(16).padStart(2, "0")).join("");
}
function keys(value, expected) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).length !== expected.length || expected.some(key => !Object.hasOwn(value, key))) throw new Error("The file has an unsupported structure.");
}
export function validateState(state, complete = false) {
  keys(state, ["reviewed", "assessment"]);
  keys(state.assessment, ["decision", "finding", "limitation", "next_check"]);
  if (!Array.isArray(state.reviewed) || state.reviewed.length > 2 || new Set(state.reviewed).size !== state.reviewed.length ||
      state.reviewed.some(id => !CASE.evidence.some(e => e.id === id))) throw new Error("The evidence review list is invalid.");
  for (const [key, limit] of [["decision", 30], ["finding", 1200], ["limitation", 800], ["next_check", 800]]) {
    if (typeof state.assessment[key] !== "string" || state.assessment[key].length > limit) throw new Error("An assessment field is invalid or too long.");
  }
  if (state.assessment.decision !== "" && !Object.hasOwn(DECISIONS, state.assessment.decision)) throw new Error("The assessment decision is unsupported.");
  if (complete && Object.keys(assessmentErrors(state)).length) throw new Error("This handover is incomplete. Review both sources and complete the assessment.");
}
async function references() {
  return Promise.all(CASE.evidence.map(async e => ({ id: e.id, sha256: await sha256(e.text) })));
}
export async function makeRecord(kind, state, now = new Date()) {
  if (!["draft", "handover"].includes(kind)) throw new Error("Unsupported record kind.");
  validateState(state, kind === "handover");
  const snapshot = JSON.parse(JSON.stringify(state));
  const payload = {
    schema_version: 1, kind, training: true, tool_version: VERSION,
    case_id: CASE.id, case_revision: CASE.revision, created_at: now.toISOString(),
    evidence: await references(), state: snapshot,
  };
  return { payload, sha256: await sha256(canonical(payload)) };
}
export async function parseRecord(text, expectedKind) {
  if (typeof text !== "string" || new TextEncoder().encode(text).length > MAX_FILE_BYTES) throw new Error("Choose a practice JSON file no larger than 64 KiB.");
  let record;
  try { record = JSON.parse(text); } catch { throw new Error("This is not a readable JSON file. Choose a draft or handover downloaded from this practice."); }
  keys(record, ["payload", "sha256"]);
  const p = record.payload;
  keys(p, ["schema_version", "kind", "training", "tool_version", "case_id", "case_revision", "created_at", "evidence", "state"]);
  if (p.schema_version !== 1 || p.training !== true || p.tool_version !== VERSION || p.case_id !== CASE.id || p.case_revision !== CASE.revision)
    throw new Error("This file belongs to an unsupported practice edition. Use the matching version of the tool.");
  if (!["draft", "handover"].includes(p.kind)) throw new Error("Unsupported record kind.");
  if (p.kind !== expectedKind) throw new Error(p.kind === "draft" ? "This is a draft. Use Resume a draft to continue writing it." : "This is a handover. Use Review a handover to read it.");
  if (typeof p.created_at !== "string" || p.created_at.length > 30 || !Number.isFinite(Date.parse(p.created_at)) || new Date(p.created_at).toISOString() !== p.created_at)
    throw new Error("The record's creation time is invalid.");
  validateState(p.state, p.kind === "handover");
  if (!Array.isArray(p.evidence) || p.evidence.length !== 2) throw new Error("The evidence references are invalid.");
  for (const item of p.evidence) {
    keys(item, ["id", "sha256"]);
    if (typeof item.id !== "string" || typeof item.sha256 !== "string") throw new Error("The evidence references are invalid.");
  }
  const refs = await references();
  if (canonical(p.evidence) !== canonical(refs)) throw new Error("The evidence references do not match this practice edition.");
  if (typeof record.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(record.sha256) || await sha256(canonical(p)) !== record.sha256)
    throw new Error("The record's checksum does not match. Obtain the intended file; the current work has not been replaced.");
  return record;
}
