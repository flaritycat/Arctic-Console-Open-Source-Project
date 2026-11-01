# Arctic Console 0.2.1 · First-use review

[Try Northern Bay](https://flaritycat.github.io/Arctic-Console-Open-Source-Project/practice.html) · [Download both tools and the checksum](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/arctic-console-v0.2.1).

## What changed in practice

| Reproduced on 0.2.0 in Chromium | Behavior in 0.2.1 |
| --- | --- |
| Submit an empty assessment, then correct just one field. All remaining warnings disappear. | Each unresolved field keeps its own instruction. Typing preserves the draft and keyboard focus. |
| Try to write before reading the sources, then mark both reviewed. The page shows both an error and a success message. | The evidence status updates as the analyst makes progress. |
| At a 320-pixel viewport, open a handover with a long, unbroken filename. The reader scrolls sideways. | The full name wraps and the reader still fits the screen. |

These are reproduced engineering findings, not claims about observed participants. The automated regressions failed on the 0.2.0 practice and exercise the same actions on this release. The reader accepts schema 1 Northern Bay edition 1 files created by either 0.2.0 or 0.2.1. Tests use fixed draft and handover examples generated with the tagged 0.2.0 writer. New files identify their writer as 0.2.1.

## What maintainers can do now

- **P03:** use the [bug and improvement forms and review instructions](../CONTRIBUTING.md). The first-contribution path is checked from a fresh clone: create a branch, make a small documentation edit, inspect the diff and run its checks. This is an engineering rehearsal, not a new contributor survey.
- **P06:** give each person their [role assignment](first-use-tasks.md). Use the [facilitator guide](first-use-session.md) and [blank private scorecard](first-use-scorecard.md). A standard fictional handover is available for a reader who has no paired author. Its checksum is valid; its broad geographic claim needs scrutiny.

No observed first-time cohort, screen-reader user study, scientific qualification or real ownership transfer is claimed. The release adds no runtime libraries, tracking or automatic sending. The release page records the verified ZIP checksum and CI run.

For rollback, retain the [0.2.0 release](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/arctic-console-v0.2.0); its reader does not accept new 0.2.1 records. Keep this release's offline viewer for those files. See the [release and rollback procedure](releasing.md).
