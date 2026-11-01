# Contribute to Arctic Console

Start with the analyst’s task. For a bug, describe what you tried, what you expected, what happened and how to reproduce it using synthetic material. Include the browser and project version. [Open an issue](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/issues) · [Private security reporting](SECURITY.md)

For clone, update and pull request instructions, follow the [repository guide](docs/repository-guide.md). The [software guide](docs/software-guide.md) provides the first-use exercise.

For Evidence Check, open `tools/evidence-check.html` directly in a desktop or mobile browser. Run `node --test tools/tests/evidence-check.test.mjs` with Node.js 22 or newer. Check both a matching file and a modified file in a browser with its network connection disabled.

In a pull request, describe the change and the checks you ran. Keep test evidence synthetic or explicitly redistributable. Identify third-party material and its license. Disclose material AI assistance and review the result. Contributions you intentionally submit for inclusion are offered under Apache-2.0 as described in section 5 unless you explicitly state otherwise. [License](LICENSE)

When adding an action, library, asset or data source, update [the third-party register](THIRD_PARTY.md), preserve its original notices and run `node tools/check-third-party.mjs`.
