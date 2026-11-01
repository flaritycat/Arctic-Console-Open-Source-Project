# Execution plan

Updated 1 November 2026. Read with [the roadmap](../ROADMAP.md). This plan preserves the original analyst-first objective while reflecting the current public/private split. It is newly written planning text; earlier application code, screenshots, diagrams and private study records are not attached.

## Status and operating rules

**Done** means published with evidence. **Ready** means work can begin in the public repository. **Planned** means its preceding work is incomplete. **Conditional** means a stated right, deployment or external review is still needed. Roles are proposed until someone accepts them.

The public baseline is [Arctic Console 0.2.0](release-0.2.0.md): Evidence Check and an offline, fictional practice case. P00 records the earlier Evidence Check release. The earlier application has its own private implementation and test history. Do not present those as public-product capabilities or reopen every historical defect without checking the current code.

Use one small product slice at a time. Release useful accepted increments while external dependencies remain open. No fixed one-year wait or unsupported completion date is assumed.

## Work register

| ID / priority | Status | Work and proposed responsibility | Dependencies | Completion evidence |
| --- | --- | --- | --- | --- |
| P00 / foundation | Done | Public tool, guides, references and legal-notice corrections. Maintainer + engineering. | None | [Versioned release](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/evidence-check-v0.1.1) and [review](legal-review.md). |
| P01 / P0 | Conditional | Record permission or a lawful replacement decision for earlier source and diagrams. Maintainer with relevant rights holders/advice. | External authority | Scope, evidence, affected material and release decision recorded; references alone do not count. Sensitive records stay private. |
| P02 / P0 | Done | Turn the current package preparation into a repository-owned, repeatable release procedure. Engineering + release maintainer. | P00 | Clean-checkout package; all files/notices enumerated; checksum and uploaded bytes verified; tagged source; documented way to retain and restore the previous release. [Build, verification and rollback](releasing.md); [tagged download and checksum](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/arctic-console-v0.2.0). |
| P03 / P1 | Ready | Make contributor intake actionable. Maintainer + reviewer. | P00 | Small-task guidance, bug report and contribution templates, rights/AI disclosure, named review responsibility and clear paths for sensitive reports. Exercise the instructions from a clean checkout. |
| P04 / P0 | Done | Define the first public practice assignment and screen sequence. Product/design + engineering. | New material with established rights | Fictional case, expected decisions, explicit training label, first-use copy and acceptance fixtures. No private source/assets imported. [Case specification, expected interpretation and acceptance fixtures](practice-case.md). |
| P05 / P0 | Done | Implement the practice workflow. Engineering + design. | P04 | Open alert, inspect evidence, write a limitation and next step, save work, produce a handover and inspect it in a fresh reader session. Invalid/incomplete work has an understandable recovery path. [Practice guide](practice-guide.md) and [release checks and limitations](release-0.2.0.md). |
| P06 / P0 | Planned | Test and simplify the practice experience. Research + design. | P05 and available participants | Observed results separated from scripted rehearsals; failures retained; keyboard/mobile/zoom checks; fixes trace back to an observed misunderstanding. |
| P07 / P0 | Conditional | Map current private capabilities to the public release route. Engineering + maintainer. | P01 for reuse/publication | Versioned gap assessment: present and verified, present but unverified, missing, excluded. Reuse accepted work rather than scheduling a blanket rewrite. |
| P08 / P0 | Conditional | Qualify the first observation product and calculation scope. Domain reviewer + data engineering. | Authorized data, current product documentation, independent reviewer | Reproducible samples, source versions/hashes, attribution, supported geometries, population/filter policy and signed reviewer conclusion or required changes. |
| P09 / P0 | Conditional | Deliver the scoped investigation journey. Engineering + design. | P07, P08; appropriate permissions | Area/date selection without an alert; truthful source and calculation states; immutable citation; preserved draft; independently checkable finding. |
| P10 / P0 | Conditional | Qualify shared Operations and handover recovery. Backend + frontend + QA. | P07 and authorized test environment | Permission/role checks, version conflicts, acknowledged save, handover request versus acceptance, interrupted replies, retries and reload all preserve correct ownership and evidence. |
| P11 / P0 | Conditional | Resolve full-application distribution and operational requirements. Release/operations + maintainer. | Chosen release contents and P01 | Platform-specific notices and required source material, documented dependency/service choices, installed-artifact inventory, restore and rollback checks. Existing private audit findings remain tracked. |
| P12 / P0 | Conditional | Run a supervised pilot and decide the supported release scope. Product owner + team lead + domain/support leads. | P06, P08–P11 and authorized team/host | Two work cycles; observed task outcomes, interruptions, support demands and repeat use; critical defects resolved; explicit accept/narrow/defer decision. |

P0 indicates a dependency for the next relevant release, not an instruction to start every P0 simultaneously. P03 is ready. P06 can move into observed sessions when real participants are available; scripted browser rehearsals do not satisfy it. P01 can proceed independently without publishing the earlier source.

## Practice and UI acceptance

The initial public practice case uses clearly fictional data so a beginner can learn the workflow without confusing it with an Arctic measurement or live operational task.

- Show what the assignment asks, why the alert exists and the next useful action before technical metadata.
- Make evidence and its limitations readable before asking for a decision. Separate a file-integrity result from the meaning of the evidence.
- Start assessment fields empty. Explain what is missing beside the action; preserve entered work on recoverable errors.
- Provide an explicit save/export path and explain any local persistence. Update the data-handling notice if behavior changes.
- A local training handover must say it is a simulation. A downloaded file is not proof of delivery or acceptance. A second reader should open the saved artifact independently.
- Keep advanced details optional. Verify text alternatives, focus order, keyboard completion, contrast, error announcements, 320 CSS px layout and 200% zoom. Work toward [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/); automated scans alone do not establish conformance.

**Proposed formative threshold:** at least five observed attempts per relevant role and experience cohort, at least four of five unaided completions per core task, and no critical interpretation or ownership error. Count helped, incorrect and abandoned attempts. This is a small-sample product decision threshold, not statistical proof of general usability. Engineering rehearsals do not count as participants. If a core task fails, repair it and repeat with fresh participants before claiming the threshold is met.

## Arctic investigation acceptance

Start with one qualified product. The current candidate is OSI SAF sea-ice concentration; the [OSI-408-g product record](https://osi-saf.eumetsat.int/products/osi-408-g) identifies the product and its technical documentation. Check the applicable edition and archive at implementation time. Follow the provider's [licensing and attribution instructions](https://osi-saf.eumetsat.int/licensing-and-attribution), including citation and identification of modifications.

Qualification must establish the intended scientific question, not just a successful download:

1. Preserve the selected shape, actual sampled shape, observation interval, units and quality rule with every finding.
2. Distinguish a retained zero, a screened value, an empty eligible population, missing data and failed retrieval.
3. Explain whether a comparison uses each day's eligible observations or the same locations on both days. Do not infer region-wide change or ice-edge motion from an unsupported aggregate.
4. Test boundaries, holes, invalid geometry, unsupported projections and antimeridian cases. Reject or explicitly qualify unsupported requests.
5. Pin source bytes or a documented recoverable reference, method/version, sampling rule and unrounded result. A later extraction must not silently replace an earlier citation.
6. Have a second reader reproduce the supported result or identify the specific evidence gap. Record independent scientific acceptance separately from matching hashes and passing tests.

The private project contains calculation and practice-review preparation. That is an input to P07–P08, not evidence that independent review has happened or permission to copy its assets into this repository.

## Shared Operations acceptance

Keep authorization, assessment versions and ownership transitions on the server. The sender remains responsible until the agreed acceptance transition succeeds. Display request, delivery and acknowledgement as different states.

Exercise an outdated assessment, another user's unauthorized access, concurrent edits, lost replies, repeated requests, a reload and restored backups. Recovery must identify the actual server state without silently duplicating a handover or discarding the analyst's note. Preserve the original evidence references and recorded authorship. Requalify the actual deployment configuration and fail safely when identity or source access is unavailable.

## Pilot and release decisions

Before a live pilot, record the authorized host, data-use basis, responsible team, named support/domain roles, access model, restore procedure and rollback route. None is inferred from a local preview or a passing CI job.

Measure task completion, time to a verified finding, critical errors, help requests, repeat use and reasons for abandoning work. Report environment and failures alongside timings. Set performance budgets against the actual pilot workload rather than presenting a local benchmark as a service promise.

Each release record needs: source tag, artifact hash, included work IDs, actual tests and human/domain evidence, notices, limitations, unresolved decisions and rollback instructions. Keep older releases identifiable. Do not enable a new provider or scientific method merely because an unrelated workflow passed.

## Updating this plan

At completion, change the row's status and link its evidence. On a blocker, identify the missing decision and continue independent ready work. Give dates only after an owner accepts the package and its dependencies are available. Change the scope openly when evidence warrants it; never convert a proposed target into an achieved result.
