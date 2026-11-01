# Third-party software and services

Reviewed on 1 November 2026 for the public Evidence Check repository.

## What the public download contains

Arctic Console 0.2.1 contains Evidence Check and the fictional practice case: project-developed HTML, JavaScript and CSS, synthetic examples, the Apache-2.0 license and accompanying notices. The complete license and AI notice are embedded in both HTML tools. There are no downloaded runtime JavaScript libraries, fonts, map layers, real Arctic observations or third-party images in either tool. The browser implements SHA-256 through Web Crypto and is installed separately. Node.js and Python are development prerequisites and are not shipped in the offline ZIP. [Browser API](https://www.w3.org/TR/WebCryptoAPI/) · [Node.js notices](https://github.com/nodejs/node/blob/v24.19.0/LICENSE) · [Python license](https://docs.python.org/3.14/license.html)

The full Investigation and Operations application, its dependencies and earlier diagrams remain outside this public repository while their publication rights are reviewed. Apache-2.0 in this repository does not grant rights to that separate material. [Project license](LICENSE) · [Contributors and AI assistance](AUTHORS.md)

## Build and hosting components

Browser tests use **Playwright 1.60.0** and **playwright-core 1.60.0**, under [Apache-2.0 at the published source commit](https://github.com/microsoft/playwright/blob/87bb9ddbd78f329df18c2b24847bc9409240cd07/LICENSE). The lockfile also includes the optional macOS dependency **fsevents 2.3.2**, under [MIT](https://github.com/fsevents/fsevents/blob/a7f5d00939b74e141a73131468c4ce48ee0f2197/LICENSE). These packages include their own upstream notices and bundled dependency notices in their published distributions. They and the downloaded Chromium test browser are development tools, excluded from the offline release. Preserve their notices if redistributing those tools separately. [Exact development source register](third_party/development.json) · [Locked packages](package-lock.json)

Packaging uses only Python standard-library modules. The practice builder and unit tests use Node.js standard modules. Neither build tool introduces a runtime package into the generated HTML.

GitHub Actions runs the checks and GitHub Pages serves the tool. These services are separate from the offline application. Each action below is published under MIT; its bundled dependencies retain their own notices. The exact source and license links are recorded in [the action register](third_party/actions.json).

| Component | Pinned edition | Source and license |
| --- | --- | --- |
| actions/checkout | v7.0.1 | [Source](https://github.com/actions/checkout/tree/3d3c42e5aac5ba805825da76410c181273ba90b1) · [MIT text](https://github.com/actions/checkout/blob/3d3c42e5aac5ba805825da76410c181273ba90b1/LICENSE) |
| actions/upload-pages-artifact | v5.0.0 | [Source](https://github.com/actions/upload-pages-artifact/tree/fc324d3547104276b827a68afc52ff2a11cc49c9) · [MIT text](https://github.com/actions/upload-pages-artifact/blob/fc324d3547104276b827a68afc52ff2a11cc49c9/LICENSE) |
| actions/deploy-pages | v5.0.1 | [Source](https://github.com/actions/deploy-pages/tree/368f82528645a54fb793d4d04e342629a3f51346) · [MIT text](https://github.com/actions/deploy-pages/blob/368f82528645a54fb793d4d04e342629a3f51346/LICENSE) |
| actions/upload-artifact | v7.0.0; invoked by the Pages upload action | [Source](https://github.com/actions/upload-artifact/tree/bbbca2ddaa5d8feaa63e36b76fdaad77386f024f) · [MIT text](https://github.com/actions/upload-artifact/blob/bbbca2ddaa5d8feaa63e36b76fdaad77386f024f/LICENSE) |

The upload action's nested action reference was inspected in its [pinned action definition](https://github.com/actions/upload-pages-artifact/blob/fc324d3547104276b827a68afc52ff2a11cc49c9/action.yml). Checkout's dependency notices are in [its pinned notice directory](https://github.com/actions/checkout/tree/3d3c42e5aac5ba805825da76410c181273ba90b1/.licenses). This register identifies build components; it does not relicense GitHub's service or every component of a hosted runner. [GitHub terms](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)

## When changing or redistributing the project

Keep the Apache-2.0 license with copies of the application. If you add third-party code, assets, datasets or runtime packages, record their exact versions, source URLs, license texts, notices and any modifications here before releasing them. Preserve the upstream copyright and attribution in the shipped artifact. A package's short license label is evidence to investigate, not a substitute for its actual notice.

Run `node tools/check-third-party.mjs` after changing a workflow or this register. It rejects unregistered or unpinned action references. Update the register and inspect the new upstream source and notices when changing a pin. For tool changes, also run `node --test tools/tests/evidence-check.test.mjs` and follow the [repository guide](docs/repository-guide.md).

## Source references and permission

See [the reference and permission record](REFERENCES.md) for materials whose rights require clarification. A reference gives credit; it does not grant reuse permission. A missing license file is assessed separately from a missing license declaration. Explicit upstream grants and their conditions remain controlling.
