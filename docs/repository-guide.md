# Use the public repository

A repository is the project’s versioned collection of files on GitHub. Arctic Console’s public repository contains the guided practice case, Evidence Check, synthetic examples, build and test tools, guides and license. You can use the browser tool without a GitHub account, Git or Node.js. [Software guide](software-guide.md)

## Choose your starting point

| You want to | Start here |
| --- | --- |
| Try the software | Open the hosted tool and follow the sample exercise in the software guide. |
| Keep a tested offline copy | Download the named ZIP from a release. |
| Read or change the code | Browse the files on GitHub or clone the repository. |
| Report a problem | [Report a bug](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/issues/new?template=bug.yml) or [suggest one improvement](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/issues/new?template=small-task.yml). |
| Contribute a fix | Create a branch, verify the change and open a pull request. |

The full Investigation and Operations source remains in private review while its earlier code and diagram rights are confirmed. Public contributions should use material whose publication and license you can establish.

## Find the files

| Location | Purpose |
| --- | --- |
| `README.md` | Project introduction and links to the tool and release |
| `ROADMAP.md` and `docs/execution-plan.md` | Current delivery stages, work priorities, dependencies and completion evidence |
| `docs/software-guide.md` | How to complete a check and use its result |
| `practice/`, `tools/practice.html` | Editable practice sources and their generated offline application |
| `release.json`, `tools/release.py` | Included source files, packaging and independent archive verification |
| `tools/evidence-check.html` | The standalone application, including its interface and JavaScript |
| `tools/examples/sample-observation.txt` | The fictional sample used by the exercise and tests |
| `tools/tests/evidence-check.test.mjs` | Automated checks for results, errors, stale inputs and saved records |
| `.github/workflows/evidence-check.yml` | GitHub checks and publication of the hosted tool |
| `CONTRIBUTING.md` and `SECURITY.md` | Contribution instructions and private security reporting |
| `THIRD_PARTY.md` and `third_party/actions.json` | Third-party sources, license links and exact build-action versions |
| `DISCLAIMER.md`, `LICENSING.md` and `PRIVACY.md` | AI disclosure, licensing scope and data handling |
| `docs/legal-review.md` | Findings, corrections, primary sources and unresolved legal questions |
| `tools/sync-legal-notices.mjs` | Keeps complete license and AI texts inside the standalone HTML |
| `LICENSE` and `AUTHORS.md` | License terms and contributor credits |

On GitHub, choose a file to read it. **History** shows its changes. The branch selector chooses the version of the project you are viewing.

## Download a release

A release is a named version with downloadable files. Use **Releases**, open **Arctic Console 0.2.1**, then expand **Assets**. Download `arctic-console-0.2.1.zip` for the offline application. Its matching `.sha256` file records the ZIP’s checksum. GitHub also offers source archives containing the repository files. [Release page](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/arctic-console-v0.2.1)

To check the offline ZIP on Windows, open PowerShell in the download folder and run the following commands.

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\arctic-console-0.2.1.zip'
Get-Content -LiteralPath '.\arctic-console-0.2.1.zip.sha256'
```

Compare the full `Hash` with the first value in the checksum file. Upper- and lowercase letters mean the same value. Then extract the ZIP. Open `practice.html` for the assignment or `evidence-check.html` for a file check. Keep the included license with redistributed copies.

Version 0.1.1 includes the complete license and AI notice inside the HTML and accompanying records in the ZIP. The 0.1.0 release retains its original contents; later documentation does not retroactively add conditions.

A release provides a fixed version. The `main` branch contains the current repository work. **Code → Download ZIP** downloads the selected branch.

## Work with a local checkout

Install Git to clone and update source. Node.js 22 or newer runs the tests; Python 3.11 or newer builds the package. Run `npm ci --ignore-scripts` to install the pinned browser-test dependencies and `npx playwright install chromium` for the test browser. These tools are for contributors; users need only a browser.

From a terminal, run:

```sh
git clone https://github.com/flaritycat/Arctic-Console-Open-Source-Project.git
cd Arctic-Console-Open-Source-Project
git remote -v
git status
```

The remote named `origin` should point to the public repository. A clean checkout reports no local changes. Open `tools/evidence-check.html` in a browser to run your local copy.

Before updating, run `git status`. If it shows work you want to keep, commit it on a branch before updating. With a clean `main` checkout, run:

```sh
git switch main
git pull --ff-only
```

If Git reports that the branches have diverged, inspect the local and remote commits before deciding how to combine them. A force push can replace published history.

## Contribute a change

1. Read the contribution instructions. Describe the analyst task and expected behavior.
2. If you lack write access, use **Fork** on GitHub to create a copy under your account. Clone that fork. A fork retains a link to this project.
3. Create a branch for your change.
4. Edit the relevant files and run the tests. For software changes, also try a matching file and a changed file in the browser.
5. Review the diff, commit the intended files and push your branch.
6. Open a pull request on GitHub. A pull request asks the maintainer to review your branch for inclusion. Describe what changed and which checks you actually ran.

For a documentation change in your own checkout, the commands could be:

```sh
git switch -c codex/clarify-user-guide
npm test
git diff --check
git diff -- docs/software-guide.md
git add docs/software-guide.md
git commit -m "Clarify the evidence check instructions"
git push -u origin codex/clarify-user-guide
```

Use a branch name and file paths appropriate to your change. Keep credentials and real case files outside commits. Identify third-party material, preserve its notices and disclose material AI assistance. [Contribution instructions](../CONTRIBUTING.md) · [License](../LICENSE)

## Understand checks and publication

For repeatable ZIP creation, uploaded-asset verification and rollback, follow [the release procedure](releasing.md). It builds only the committed files explicitly listed in `release.json` and requires a clean checkout.

The **Evidence Check** workflow runs for changes to the tool, license, third-party register, reference record, legal/data-handling notices, credits, security policy or workflow on `main` and in pull requests. It can also be started from the **Actions** tab by a maintainer. It also covers Markdown guides, practice sources, packaging and dependency changes.

A successful run for `main` packages the application HTML, license, third-party register, reference record, disclaimer, licensing scope, data-handling notice, credits and security policy and publishes them to GitHub Pages. The workflow’s **check** job verifies the tool and embedded notice completeness; **publish** updates the hosted page. Release ZIPs are separate versioned downloads and retain the version they were created from.

For a failed check, open **Actions**, select the run and inspect the failed step. Fix the cause and verify the correction before merging. Report security problems through the private reporting process. [Security policy](../SECURITY.md)

For practice source changes, run `npm run build`, `npm run check:generated`, `npm test`, `npm run test:browser` and `python -m unittest discover -s tools/tests -p 'test_*.py'`. The browser checks use fictional files and keep screenshots under ignored `test-results/`. [Practice source specification](practice-case.md)
