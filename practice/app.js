// Copyright 2026 Arctic Console contributors. SPDX-License-Identifier: Apache-2.0
const byId = id => document.getElementById(id);
let state = blankState();
let screen = 0;
let lastAuthorScreen = 0;
let revision = 0;
let importToken = 0;
let exporting = false;
let readerRecord = null;
let validatingAssessment = false;
const fields = ["decision", "finding", "limitation", "next_check"];

function message(text = "") { byId("message").textContent = text; }
function error(text = "", focus = true) {
  byId("error").textContent = text;
  byId("error").hidden = !text;
  if (text && focus) byId("error").focus();
}
function hasWork() { return state.reviewed.length > 0 || fields.some(key => state.assessment[key]); }
function invalidate() {
  revision++;
  byId("handover-ready").hidden = true;
  message();
}
function drawProgress() {
  byId("draft-actions").hidden = screen === "reader" || (screen === 0 && !hasWork());
  for (const e of CASE.evidence) {
    const checked = state.reviewed.includes(e.id);
    byId("review-" + e.id).textContent = checked ? "Reviewed — you can reopen this source" : "Not reviewed yet";
    document.querySelector('[data-review="' + e.id + '"]').textContent = checked ? "Reviewed" : e.id === "observations" ? "Mark observations reviewed" : "Mark sampling note reviewed";
  }
  byId("review-progress").textContent = state.reviewed.length + " of 2 sources reviewed";
  document.querySelectorAll("[data-step]").forEach(button => {
    const step = Number(button.dataset.step);
    button.disabled = (step === 2 && state.reviewed.length !== 2) || (step === 3 && Object.keys(assessmentErrors(state)).length > 0);
    if (step === screen) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
}
function fillSummary(id, assessment) {
  const list = byId(id);
  list.replaceChildren();
  for (const [key, label] of [["decision", "Next action"], ["finding", "Finding"], ["limitation", "Limitation"], ["next_check", "Next check"]]) {
    const title = document.createElement("dt");
    title.textContent = label;
    const value = document.createElement("dd");
    value.textContent = key === "decision" ? DECISIONS[assessment.decision] : assessment[key];
    list.append(title, value);
  }
}
function show(next, focus = true) {
  if (next === 2 && state.reviewed.length !== 2) { error("Read and mark both sources reviewed before writing the assessment."); return; }
  if (next === 3 && Object.keys(assessmentErrors(state)).length) { showErrors(); return; }
  if (screen !== next) importToken++;
  if (screen !== "reader") lastAuthorScreen = screen;
  screen = next;
  message(); error();
  document.querySelectorAll("[data-screen]").forEach(panel => { panel.hidden = panel.dataset.screen !== String(next); });
  document.querySelector(".steps").hidden = next === "reader";
  byId("draft-actions").hidden = next === "reader";
  byId("open-reader").hidden = next === "reader";
  if (next === 3) fillSummary("author-summary", state.assessment);
  drawProgress();
  if (focus) byId("heading-" + next).focus();
}
function renderFieldErrors(problems) {
  for (const key of fields) {
    const field = byId(key), hint = byId(key + "-error");
    const problem = problems[key] || "";
    if (problem) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    if (hint.textContent !== problem) hint.textContent = problem;
    hint.hidden = !problem;
  }
}
function clearFieldErrors() {
  validatingAssessment = false;
  renderFieldErrors({});
}
function showErrors() {
  const problems = assessmentErrors(state);
  if (problems.evidence) { error(problems.evidence); return; }
  validatingAssessment = true;
  renderFieldErrors(problems);
  const first = fields.find(key => problems[key]);
  if (first) {
    error("Your draft is still here. Complete the marked fields before preparing a handover.", false);
    byId(first).focus();
  }
}
function download(record, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2) + "\n"], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function exportRecord(kind) {
  if (exporting) return;
  exporting = true;
  const startRevision = revision;
  const button = byId("download-" + kind);
  button.disabled = true;
  error();
  try {
    const record = await makeRecord(kind, state);
    if (startRevision !== revision) { error("Your assessment changed while the file was being prepared. Download the current version again."); return; }
    download(record, "arctic-practice-" + kind + ".json");
    if (kind === "handover") byId("handover-ready").hidden = false;
    message(kind === "draft" ? "Draft download prepared. Keep the file to resume; this page does not save it automatically." : "Handover download prepared. It has not been sent or accepted.");
  } catch (e) { error(e.message); }
  finally { exporting = false; button.disabled = false; }
}
async function importRecord(input, kind) {
  const file = input.files[0];
  if (!file) return;
  input.value = ""; // The captured File remains readable; the same file can be selected again.
  const token = ++importToken;
  const originalRevision = revision;
  error(); message("Checking the selected file…");
  try {
    if (file.size > MAX_FILE_BYTES) throw new Error("Choose a practice JSON file no larger than 64 KiB.");
    const record = await parseRecord(await file.text(), kind);
    if (token !== importToken) return;
    if (kind === "draft") {
      if (originalRevision !== revision) throw new Error("Your draft changed while the file was loading. Choose the file again if you still want to replace it.");
      if (hasWork() && !window.confirm("Replace the draft in this page? Download it first if you want to keep it.")) { message("Import cancelled. Your current draft is unchanged."); return; }
      state = record.payload.state;
      for (const key of fields) byId(key).value = state.assessment[key];
      clearFieldErrors();
      invalidate();
      show(state.reviewed.length === 2 ? 2 : 1);
      message("Draft restored. Review it before preparing a handover.");
    } else {
      readerRecord = record;
      fillSummary("reader-summary", record.payload.state.assessment);
      byId("reader-created").textContent = "Opened: " + file.name + " · Recorded time: " + record.payload.created_at + " (from the author's device; not a trusted timestamp)";
      byId("reader-fingerprint").textContent = "Record SHA-256: " + record.sha256;
      for (const e of CASE.evidence) byId("reader-" + e.id).textContent = e.text;
      byId("reader-result").hidden = false;
      byId("reader-reviewed").checked = false;
      byId("reader-finished").hidden = true;
      message("Handover opened. Read the saved assessment and check its sources.");
      byId("reader-result").scrollIntoView({ block: "start" });
    }
  } catch (e) {
    if (token === importToken) {
      message();
      error(e.message + (kind === "handover" && readerRecord ? " The previously opened handover is still displayed below." : ""));
    }
  }
}
for (const key of fields) byId(key).addEventListener("input", () => {
  state.assessment[key] = byId(key).value;
  invalidate();
  if (validatingAssessment) {
    const problems = assessmentErrors(state);
    renderFieldErrors(problems);
    if (!Object.keys(problems).length) error();
  } else error();
  drawProgress();
});
document.querySelectorAll("[data-review]").forEach(button => button.addEventListener("click", () => {
  const id = button.dataset.review;
  if (!byId("source-" + id).open) return;
  if (!state.reviewed.includes(id)) state.reviewed.push(id);
  invalidate(); error(); drawProgress();
  message(state.reviewed.length === 2 ? "Both sources reviewed. You can write your assessment." : "Source marked reviewed. Read the other source next.");
}));
document.querySelectorAll("[data-step]").forEach(button => button.addEventListener("click", () => show(Number(button.dataset.step))));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => show(Number(button.dataset.go))));
byId("start").addEventListener("click", () => show(1));
byId("to-assessment").addEventListener("click", () => show(2));
byId("assessment-form").addEventListener("submit", event => {
  event.preventDefault();
  if (Object.keys(assessmentErrors(state)).length) showErrors();
  else { clearFieldErrors(); show(3); }
});
byId("download-draft").addEventListener("click", () => exportRecord("draft"));
byId("download-handover").addEventListener("click", () => exportRecord("handover"));
byId("draft-file").addEventListener("change", () => importRecord(byId("draft-file"), "draft"));
byId("handover-file").addEventListener("change", () => importRecord(byId("handover-file"), "handover"));
byId("open-reader").addEventListener("click", () => show("reader"));
byId("return-author").addEventListener("click", () => show(lastAuthorScreen));
byId("reset").addEventListener("click", () => {
  if (hasWork() && !window.confirm("Start over? Your current draft will be removed from this page. Download it first if you want to keep it.")) return;
  importToken++;
  state = blankState();
  for (const key of fields) byId(key).value = "";
  for (const e of CASE.evidence) byId("source-" + e.id).open = false;
  clearFieldErrors(); invalidate(); show(0);
});
byId("finish-reader").addEventListener("click", () => {
  if (!readerRecord || !byId("reader-reviewed").checked) { error("Read the assessment and sources, then tick the review confirmation."); return; }
  error(); byId("reader-finished").hidden = false;
  message("Reader practice complete locally. No acknowledgement has been sent.");
});
byId("reader-reviewed").addEventListener("change", () => { byId("reader-finished").hidden = true; error(); });
window.addEventListener("beforeunload", event => {
  if (hasWork()) { event.preventDefault(); event.returnValue = ""; }
});
show(new URLSearchParams(location.search).get("reader") === "1" ? "reader" : 0, false);
