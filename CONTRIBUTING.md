# Contribute to Arctic Console

Start with the analyst’s task. For a bug, describe what you tried, what you expected, what happened and how to reproduce it using synthetic material. Include the browser and project version. [Open an issue](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/issues) · [Private security reporting](SECURITY.md)

For clone, update and pull request instructions, follow the [repository guide](docs/repository-guide.md). The [software guide](docs/software-guide.md) provides the first-use exercise.

Before starting a larger change, identify the relevant work item in the [execution plan](docs/execution-plan.md). Keep planned capabilities distinct from those already shipped, and link completion evidence when updating the plan.

For Evidence Check, open `tools/evidence-check.html` directly in a desktop or mobile browser. Run `node --test tools/tests/evidence-check.test.mjs` with Node.js 22 or newer. Check both a matching file and a modified file in a browser with its network connection disabled.

In a pull request, describe the change and the checks you ran. Keep test evidence synthetic or explicitly redistributable. Identify third-party material and its license. Disclose material AI assistance and review the result. Contributions you intentionally submit for inclusion are offered under Apache-2.0 as described in section 5 unless you explicitly state otherwise. [License](LICENSE)

Only submit material you have the authority to provide under its stated terms, including any necessary employer or third-party permission. Identify separately licensed material and preserve its notices; submitting it does not relicense it. Mark material that is not offered as a contribution clearly. A new contribution cannot establish permission for the earlier application or diagrams. [Licensing scope](LICENSING.md)

When adding an action, library, asset or data source, update [the third-party register](THIRD_PARTY.md), preserve its original notices and run `node tools/check-third-party.mjs`.

When changing `LICENSE` or `DISCLAIMER.md`, run `node tools/sync-legal-notices.mjs --write` to update the complete notices carried inside the standalone HTML, then `node tools/sync-legal-notices.mjs --check` and `node --test tools/tests/*.test.mjs`. The generator copies the legal texts without interpreting them. Review their substance separately.

Follow [the reference policy](REFERENCES.md): use source links for reference-only material and establish permission before copying it. Attribution alone does not make unlicensed material available under Apache-2.0.

The [AI development notice](DISCLAIMER.md) does not excuse missing permissions or required credits. Describe material AI assistance accurately; do not characterize third-party code as project-generated. Report suspected similarities or attribution omissions with the affected version and source evidence.
