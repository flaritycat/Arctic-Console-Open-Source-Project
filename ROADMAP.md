# Arctic Console delivery roadmap

Updated 1 November 2026. This is the current public plan. It replaces the earlier calendar-led approach with small deliveries and explicit acceptance checks. The aim is to finish useful increments as soon as their dependencies are satisfied, not to wait for a one-year programme.

## Product outcome

Serve analysts investigating Arctic data and evidence. A first-time analyst should understand the assignment, inspect its sources, record a qualified assessment and give another analyst enough information to continue. An area-based investigation should also work without an alert.

Keep the first experience simple: one task, a clear next action, plain-language explanations and optional detail. A chart, score, file match or successful handover must say exactly what it establishes.

## What is available today

| Area | Verified position | Evidence |
| --- | --- | --- |
| Public software | Evidence Check 0.1.1 compares a local file with a supplied SHA-256 and saves a check record. It is not the full investigation or Operations console. | [Release and verification](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/evidence-check-v0.1.1) |
| Public documentation | Software/repository guides, source references, AI disclosure, licensing scope and data-handling records are published. | [Guides](docs/software-guide.md) · [Legal review](docs/legal-review.md) |
| Full application | Earlier investigation, assessment and handover implementation remains in private review. Existing engineering work should be assessed before scheduling replacement work. It is not a publicly released or field-qualified product. | [Permission record](REFERENCES.md) |
| Human and scientific validation | No completed analyst cohort, independent scientific acceptance or authorized operational deployment is established by the public release record. | These remain explicit work items below. |

## Delivery stages

| Stage | Deliverable | Exit condition | Current status |
| --- | --- | --- | --- |
| 0. Public foundation | Evidence Check, guides and complete notices | Versioned download, verified notices and recorded engineering checks | Complete for 0.1.1 |
| 1. Maintainable public release | Repeatable packaging, contribution intake and documented release decisions | A clean checkout reproduces the candidate package; checks catch missing notices; a contributor can follow the guide | Next |
| 2. Browser practice case | Clearly labelled fictional alert → evidence → assessment → training handover | A beginner can complete the exercise without installation; a second reader can inspect the saved work; no simulated acceptance is presented as real delivery | Planned |
| 3. Scoped investigation | Area/date/source/selection → reproducible finding or an explicit unavailable result | Qualified calculation and preserved citation; another analyst can reproduce the result or identify why it cannot be reproduced | Conditional |
| 4. Shared Operations | Authenticated assignment, assessment, handover and acknowledgement | Ownership and version changes are server-confirmed; recovery and concurrent-edit checks pass | Conditional |
| 5. Supervised pilot | One authorized team and deployment, one qualified data product | Observed task performance, independent domain review, restore/rollback evidence and a documented release decision | External dependencies open |

Stages 1–2 can proceed with newly authored, appropriately licensed material. Reusing the earlier application in stages 3–4 requires established rights. If permission remains unavailable, a maintainer must record a lawful replacement approach and its scope before copying or rewriting affected material. AI generation and source links do not close that dependency.

Scientific qualification, research preparation and release maintenance can progress alongside product work. Do not add providers, complex dashboards or desktop packaging to the critical path unless a demonstrated analyst need requires them.

## Next execution order

1. Automate the public package and its source/notice checks.
2. Specify and implement one fictional browser practice assignment in small, reviewable slices.
3. Observe real first-time users and repair the specific points where they misunderstand or need help.
4. Resolve the source-reuse decision and review the existing private implementation against the acceptance criteria.
5. Qualify one Arctic observation product and connect the supported investigation.
6. Complete shared Operations and the supervised-pilot checks only when rights, participants and deployment are available.

[Detailed work packages, dependencies and acceptance criteria](docs/execution-plan.md)

## What “finished” means

For each release, record the version, included work, known limits, actual checks, open risks and rollback path. Automated passes are engineering evidence; they are not human usability results or scientific approval. A delivery is complete only when the relevant acceptance evidence exists.

The proposed accessibility target is WCAG 2.2 AA, with keyboard, screen-reader, zoom, narrow-screen and error-recovery checks. This is a target, not a current conformance claim. [W3C standard](https://www.w3.org/TR/WCAG22/)

## Dates, ownership and changes

The maintainer prioritizes and accepts releases. Engineering, design, domain-review and analyst-research roles below are responsibilities to assign, not a claim that staff or participants have been recruited. Start the next ready package immediately once an owner has capacity. Split oversized items; do not accumulate unrelated work into a single release.

Calendar commitments need an assigned owner, confirmed scope and available dependencies. Permission, independent review and team availability cannot be completed by writing a deadline. Record changed priorities and completion evidence in the detailed plan and Git history. This roadmap's publication does not mean its future features have been implemented.
