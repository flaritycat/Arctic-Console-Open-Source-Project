# Build, verify and restore a public release

Maintainers need Git, Node.js 22 or newer and Python 3.11 or newer. The application user needs only a browser. Packaging uses Python's standard library; no Python packages are installed.

## Prepare a candidate

1. Update `release.json` with the release version, tag and explicit source-to-package file mapping. Include every runtime file, applicable notice and relevant guide. No private source is implicitly included.
2. Install test dependencies with `npm ci --ignore-scripts` and `npx playwright install chromium`. Run `npm run build` to regenerate the standalone HTML and notices. Run the generated-file, unit and browser checks in the [repository guide](repository-guide.md).
3. Commit the intended files. The packager rejects a dirty checkout, untracked inputs, unsafe paths, symlinks and missing required notices.
4. In a clean checkout of that commit, run:

```sh
python tools/release.py build --output dist
python tools/release.py verify
```

By default verification reads the archive named for the version in `release.json`. Repeat the build in a second clean checkout of the same commit; the ZIP checksums must agree. The archive stores entries without compression, with fixed metadata, so compression-library versions and file timestamps do not affect its bytes. `BUILD.json` records the source commit, exact included paths and SHA-256 values.

## Publish and verify

Review the candidate, its tests, actual browser checks and open limitations. Create the exact release tag from `release.json` at the tested commit, push the tag, then publish the ZIP and adjacent checksum as GitHub Release assets for that tag. Use GitHub's release UI or `gh release create`; keep release notes in a file when using the CLI. Do not replace an existing release's assets silently.

Download both uploaded assets into a separate directory. From the clean tagged checkout run `python tools/release.py verify --archive <downloaded-zip>`. This compares the checksum, entire archive, manifest and every included byte with the committed inputs. A checksum is not a signature or a substitute for verifying the source tag.

The Pages workflow runs the same source checks and prepares the hosted files using `python tools/release.py site --output dist/site`. Use a new or empty site directory; stale files must not be published. The site contains the package files, an Evidence Check index and text aliases for the legal notices.

## Restore a previous version

Keep earlier releases and their checksums. Users can reopen an earlier downloaded package. For a hosted rollback, revert the faulty source change with a new commit, restore the matching generated files and release inputs, run the checks and deploy that commit through the Pages workflow. Record the incident and affected versions. Avoid force-pushing history or substituting files under an existing tag. If a new schema is incompatible, explain which saved records the restored version can read.

## Completion record

Record source tag, package checksum, test run, browser results, included work IDs, limitations and rollback instructions in the release notes. Archive creation alone is not release qualification.
