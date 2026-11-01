# Third-party software and services

Reviewed on 1 November 2026 for the public Evidence Check repository.

## What the public download contains

Evidence Check 0.1.0 contains the project's HTML, JavaScript and CSS, an invented observation sample and the Apache-2.0 license. There are no downloaded JavaScript libraries, fonts, map layers, Arctic observations or third-party images in the tool. The browser implements SHA-256 through Web Crypto; the browser itself is installed separately. Tests and the notice checker use Node.js standard modules. Node.js is a development prerequisite and is not shipped in the offline ZIP. [Browser API](https://www.w3.org/TR/WebCryptoAPI/) · [Node.js notices](https://github.com/nodejs/node/blob/v24.19.0/LICENSE)

The full Investigation and Operations application, its dependencies and earlier diagrams remain outside this public repository while their publication rights are reviewed. Apache-2.0 in this repository does not grant rights to that separate material. [Project license](LICENSE) · [Contributors and AI assistance](AUTHORS.md)

## Build and hosting components

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
