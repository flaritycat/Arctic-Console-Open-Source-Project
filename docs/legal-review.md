# Legal documentation and distribution review

Reviewed 1 November 2026. Public baseline: commit `49a6ab1`; revised distribution: Evidence Check 0.1.1. This is a documented technical and drafting review, not a lawyer's opinion or a determination of enforceability. It does not certify ownership, absence of infringement, or compliance in every jurisdiction.

## Scope and conclusion

The review covered the public license, AI disclaimer, README, contributor credits, contribution instructions, references, third-party register, security reporting, hosted notice delivery and offline distribution. It also checked the private source repository's contribution clause for consistency with the unresolved original-work permission.

Apache-2.0 remains the unmodified project license. An AI disclaimer cannot supply missing permissions or create general immunity. The earlier application and diagrams remain excluded. The changes below address concrete documentation and distribution problems; they do not resolve those original rights.

## Findings and corrections

| Finding in the reviewed baseline | Significance | Correction |
| --- | --- | --- |
| README called the tool and sample “original contributions” without qualification. | Development history alone does not establish exclusive originality or non-infringement. | Replaced it with the observed development process and fictional-sample description; removed the certification implication. |
| README said project materials were Apache-2.0 without defining the rights covered. | A license cannot grant rights the contributor does not possess, or create copyright in an unprotected element. | Added [LICENSING.md](../LICENSING.md), distinguishing authorized project rights, third-party material and excluded earlier work. |
| AI disclaimer restated warranty exclusions while also saying it did not expand the license. | Parallel formulations could create avoidable ambiguity about additional terms. | The [revised notice](../DISCLAIMER.md) explains sections 7–9 by reference and expressly adds no license restriction, waiver, indemnity or separate contract. |
| AI credit appeared under “Contributors” without distinguishing a development tool from a legal licensor. | Acknowledgment could be read as a claim of submission or endorsement by the provider. | Clarified the role in [AUTHORS.md](../AUTHORS.md); did not invent a legal entity or copyright owner. |
| Concern handling referred only to “substantiated” reports and promised assessment and correction. | It could imply a proof threshold or a separate service commitment. | Reports can supply available information. The notice describes a voluntary route without claimant deadlines, compulsory waiting, waiver or guaranteed outcome. |
| Single-file download carried an SPDX label and external links but not the complete license. | A recipient saving only that HTML did not receive the full license inside the file. | Embedded the complete existing license and revised AI notice in expandable, offline-readable sections. |
| The live disclaimer linked to changing main-branch text; the 0.1.0 ZIP predated it. | Current documentation must not be represented as terms already supplied with the earlier archive. | Prepared 0.1.1 with its own notices. Preserved 0.1.0 and explicitly rejected retroactive changes. |
| Local-processing statements did not explain host logging. | Local file hashing does not mean the page host receives no visitor information. | Added [data handling](../PRIVACY.md): application processing, downloaded records, GitHub Pages IP logging, external links and public issue submissions. |
| Contribution instructions did not expressly address authority and mixed licenses. | A submitter may lack employer or third-party permission; a submission cannot cure older ownership gaps. | Updated public instructions and the private source contribution clause. Separately licensed content retains its terms. |
| SHA-256 wording described a match as verifying byte equality without qualification. | A hash comparison is not a complete assertion about provenance, ownership or scientific validity. | README now states the precise observed result: the calculated hash matches the supplied reference. |
| Notice publication had no automatic completeness or freshness check. | Legal text could drift between repository and downloaded application. | Added deterministic notice synchronization and regression tests for completeness, changes, escaping and missing/duplicate markers. |

## Primary sources and their limits

- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0), especially definitions and sections 4–9: the source for distribution conditions and existing warranty/liability wording. [ASF licensing FAQ](https://www.apache.org/foundation/license-faq.html#Apply-My-Software): explains use of the unmodified license and file-level identification. These sources do not establish the project's ownership or predict a court's decision.
- [U.S. Copyright Office, AI report Part 2, executive summary and conclusion](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf): distinguishes human authorship from purely AI-generated expression and calls for case-specific analysis. This is U.S. guidance, not a worldwide rule or a conclusion about these particular files.
- [Norwegian Government, Prop. 158 L (2024–2025), section 10.5](https://www.regjeringen.no/no/dokumenter/prop.-158-l-20242025/id3109656/?ch=10): explains the Contracts Act sections 36–37 and limits on unfair contractual terms. This legislative explanation supports preserving mandatory-law qualifications; it is not a ruling on this software or a choice of Norwegian law.
- [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection): confirms visitor IP logging by the host. The application-side account of local processing was checked against this repository's code separately.
- [GitHub licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository): explains that public access alone is not a general reuse grant. [npm license metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#license): documents SPDX declarations. Neither a reference nor an automated metadata check proves an upstream publisher's chain of title.

## What remains unresolved

1. **Earlier application and diagrams.** Permission from the relevant rights holder remains unconfirmed. Keep that material private until permission or a documented lawful replacement exists. New wording does not close this issue.
2. **Case-specific rights and enforcement.** The actual licensor's authority, any employer interests, human authorship in disputed material, applicable jurisdiction, contracts and non-excludable liability require facts beyond this review. The maintainer's account name is not proof of legal identity or authority. Qualified counsel should assess a disputed claim or a commercial offering against those facts.
3. **Private full-stack redistribution.** The earlier audit's Redis terms, MinIO/PostGIS corresponding-source work and platform/native notice requirements are not cleared by this public-tool update. They do not describe components shipped in the standalone public tool.
4. **Organization-specific data obligations.** This release has no evidence-upload backend. An organization processing personal or confidential evidence still needs to assess its own authority and handling. The data-handling note is not a general GDPR certification, a statement of every party's controller/processor role or a substitute for an applicable privacy notice.
5. **Reporting operations.** The repository provides GitHub issue and private-security routes. No unverified legal-service address, response deadline or service-level guarantee has been invented. Maintainers remain responsible for handling actual reports and preserving evidence.

## Verification and release record

The legal source text is retained unchanged in `LICENSE`. The embedded license and AI notice are compared to their complete source files, including whitespace after line-ending normalization. Existing functional tests cover matching and changed files, invalid inputs, read failures, stale results and exported records. Added tests cover offline notice completeness, stale text, safe HTML escaping and malformed notice boundaries.

Release 0.1.1 is a notice/distribution update. It does not change the hash comparison algorithm or record schema. The version in exported records changes so a recipient can identify the updated distribution. Its ZIP must include the same HTML and license, the current legal/data-handling records and the synthetic example; its checksum must be checked against the uploaded asset. The final engineering results are recorded with the release. Passing them establishes the tested behavior and packaging, not legal enforceability.

Local verification completed for this revision: all 11 automated checks passed; the action register and embedded-notice check passed; the Apache license matched the publisher's text apart from whitespace; and offline Chromium checks passed at 1000 px and 390 px widths. The browser showed both complete legal texts without horizontal overflow, completed a match and mismatch, and exported a record identifying version 0.1.1. No HTTP requests occurred during that offline exercise. Both mobile states were visually inspected. All 16 offline ZIP entries were compared with their prepared source bytes.
