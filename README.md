# Arctic Console

Arctic Console is a project for analysts investigating Arctic observations and handing evidence to the next shift. This first public release contains **Evidence Check**, a standalone browser tool for comparing a received file with the SHA-256 fingerprint in a case record. The full investigation and Operations workbench is being prepared for a separate source release.

## Try Evidence Check offline

1. Open [the Evidence Check source file](tools/evidence-check.html), choose **Download raw file** on GitHub, then double-click the saved `evidence-check.html`. It runs in your browser without installation.
2. Choose an evidence file up to 64 MiB and paste the SHA-256 from the trusted case record or provider manifest. Select **Check file**.
3. If the fingerprints match, record the check alongside the source and edition. If they differ, confirm the intended edition with the sender before relying on the file.

**Try a known example.** Download the [synthetic sample](tools/examples/sample-observation.txt) using **Download raw file** and compare it against the following fingerprint. Then edit one character in a copy and compare again. The second check should report a mismatch.

```text
6e6a178eaf3ff47416d5efffb5d8ac836f22d477d9b889b79fb920ca19a94857
```

The browser reads the file locally. A match verifies byte equality against the supplied reference. The analyst still needs to verify the reference’s provenance and the scientific interpretation.

## Contribute

The tool and sample are original contributions. The browser supplies SHA-256 through Web Crypto. The tool has no downloaded runtime dependencies. Tests use the standard Node.js test runner. The public workflow uses GitHub’s [checkout action](https://github.com/actions/checkout) under its [MIT license](https://github.com/actions/checkout/blob/main/LICENSE).

Project materials in this repository are released under Apache License 2.0. [License](LICENSE) · [Contributors and AI assistance](AUTHORS.md) · [Contributing](CONTRIBUTING.md) · [Security reporting](SECURITY.md)
