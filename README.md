# Arctic Console

Arctic Console is a project for analysts investigating Arctic observations and handing evidence to the next shift. The public tools include a **guided practice case** and **Evidence Check**, a local SHA-256 comparison tool. The earlier full investigation and Operations workbench remains in private review while permission to publish its code and diagrams is confirmed.

[Try your first assessment](https://flaritycat.github.io/Arctic-Console-Open-Source-Project/practice.html): open a fictional alert, review its evidence, write an assessment and prepare a handover. No installation or account is needed. [Open Evidence Check](https://flaritycat.github.io/Arctic-Console-Open-Source-Project/) to compare a file with its recorded fingerprint.

[Download the offline release](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/arctic-console-v0.2.1) to keep both tools with their licenses, notices and guides.

**AI development disclosure:** the project-developed code in this public version was created with substantial generative-AI assistance under human direction. It may contain errors, similarities to other works or attribution omissions. The [AI, warranty and liability notice](DISCLAIMER.md) explains the applicable limitations and how to report concerns. Third-party rights and mandatory legal obligations remain applicable.

## Guides

- [Roadmap](ROADMAP.md) and [execution plan](docs/execution-plan.md) describe the next deliveries, dependencies and completion criteria.
- [Try the practice case](docs/practice-guide.md) and [build a release](docs/releasing.md).
- [Use the software](docs/software-guide.md) for the sample exercise, real evidence checks, saved records and troubleshooting.
- [First-use assignment](docs/first-use-tasks.md) and [observer instructions](docs/first-use-session.md) for trying the case with a new analyst.
- [Use the repository](docs/repository-guide.md) for releases, source files, updates and contributions.

## Try Evidence Check offline

1. Open [the Evidence Check source file](tools/evidence-check.html), choose **Download raw file** on GitHub, then double-click the saved `evidence-check.html`. It runs in your browser without installation.
2. Choose an evidence file up to 64 MiB and paste the SHA-256 from the trusted case record or provider manifest. Select **Check file**.
3. Use **Save this check** to download a JSON record for your assessment. It records the file name, size, UTC check time and both fingerprints. If the fingerprints match, keep the check alongside the source and edition. If they differ, confirm the intended edition with the sender before relying on the file.

**Try a known example.** Download the [synthetic sample](tools/examples/sample-observation.txt) using **Download raw file** and compare it against the following fingerprint. Then edit one character in a copy and compare again. The second check should report a mismatch.

```text
6e6a178eaf3ff47416d5efffb5d8ac836f22d477d9b889b79fb920ca19a94857
```

The browser calculates the fingerprint locally. A match means the calculated SHA-256 agrees with the supplied reference; it is not a guarantee of provenance or scientific validity. The hosted page uses GitHub Pages, which logs visitor IP addresses. [Data handling](PRIVACY.md)

## Contribute

Both tools were developed for this project with AI assistance; the examples and practice case are fictional. This describes their development and does not certify exclusive originality or non-infringement. The browser supplies SHA-256 through Web Crypto. Both tools run without downloaded runtime dependencies. GitHub Actions runs Node unit tests, offline Chromium journeys and Python release checks, and verifies generated HTML, embedded notices and dependency records. A successful main-branch run publishes both tools to GitHub Pages. [Third-party software and services, with pinned source and license links](THIRD_PARTY.md)

Project-developed material is offered under Apache License 2.0 within the [documented licensing scope](LICENSING.md). Third-party material retains its own terms. [License](LICENSE) · [Third-party register](THIRD_PARTY.md) · [External references and permissions](REFERENCES.md) · [Contributors and AI assistance](AUTHORS.md) · [Contributing](CONTRIBUTING.md) · [Security reporting](SECURITY.md) · [Detailed legal review](docs/legal-review.md)
