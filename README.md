# Arctic Console

Arctic Console is a project for analysts investigating Arctic observations and handing evidence to the next shift. This first public release contains **Evidence Check**, a standalone browser tool for comparing a received file with the SHA-256 fingerprint in a case record. The full investigation and Operations workbench remains in private review while permission to publish its earlier code and diagrams is confirmed.

[Open Evidence Check in your browser](https://flaritycat.github.io/Arctic-Console-Open-Source-Project/) and expand **Try a sample file**.

[Download the offline release](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/evidence-check-v0.1.0) to keep a versioned copy with its license and sample.

**AI development disclosure:** the project-developed code in this public version was created with substantial generative-AI assistance under human direction. It may contain errors, similarities to other works or attribution omissions. The [AI, warranty and liability notice](DISCLAIMER.md) explains the applicable limitations and how to report concerns. Third-party rights and mandatory legal obligations remain applicable.

## Guides

- [Use the software](docs/software-guide.md) for the sample exercise, real evidence checks, saved records and troubleshooting.
- [Use the repository](docs/repository-guide.md) for releases, source files, updates and contributions.

## Try Evidence Check offline

1. Open [the Evidence Check source file](tools/evidence-check.html), choose **Download raw file** on GitHub, then double-click the saved `evidence-check.html`. It runs in your browser without installation.
2. Choose an evidence file up to 64 MiB and paste the SHA-256 from the trusted case record or provider manifest. Select **Check file**.
3. Use **Save this check** to download a JSON record for your assessment. It records the file name, size, UTC check time and both fingerprints. If the fingerprints match, keep the check alongside the source and edition. If they differ, confirm the intended edition with the sender before relying on the file.

**Try a known example.** Download the [synthetic sample](tools/examples/sample-observation.txt) using **Download raw file** and compare it against the following fingerprint. Then edit one character in a copy and compare again. The second check should report a mismatch.

```text
6e6a178eaf3ff47416d5efffb5d8ac836f22d477d9b889b79fb920ca19a94857
```

The browser reads the file locally. A match verifies byte equality against the supplied reference. The analyst still needs to verify the reference’s provenance and the scientific interpretation.

## Contribute

The tool and sample are original contributions. The browser supplies SHA-256 through Web Crypto. The tool has no downloaded runtime dependencies. Tests use the standard Node.js test runner. GitHub Actions checks the tool and action register on pull requests. After a successful main-branch check, the HTML, license and attribution register are deployed. [Third-party software and services, with pinned source and license links](THIRD_PARTY.md)

Project materials in this repository are released under Apache License 2.0. [License](LICENSE) · [Third-party register](THIRD_PARTY.md) · [External references and permissions](REFERENCES.md) · [Contributors and AI assistance](AUTHORS.md) · [Contributing](CONTRIBUTING.md) · [Security reporting](SECURITY.md)
