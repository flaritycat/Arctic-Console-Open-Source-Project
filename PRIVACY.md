# Public field-tool data handling

This describes the public Arctic Console 0.2.0 field tools, not the separate private application.

## Files and check records

The application reads the file you select in browser memory and calculates its SHA-256 locally. Its code does not upload that file, its name, its fingerprint or the reference you enter. It implements no analytics, account system, cookies or persistent browser storage.

Selecting **Save this check** creates a local JSON download containing the file name and size, both fingerprints, the result, tool version and the computer's UTC time. It does not contain the evidence file's contents. File names and records may nevertheless reveal sensitive information; choose what to save or share accordingly. The tool does not manage or delete your downloaded files.

## Practice drafts and handovers

The fictional practice keeps your assessment and review state in the open page's memory. It does not automatically save to browser storage or send anything. Downloading a draft or handover writes a JSON file containing your assessment text, review state, fictional case identifiers, evidence fingerprints, tool version and the time from your device. Imported JSON is read locally. A reader's completion is local; no message or acknowledgement goes to a sender.

Closing or reloading the page loses in-memory work. Keep a downloaded draft to resume. The application does not manage or delete downloads. Anything typed into the practice can appear in the saved file; do not use personal or real case information for this training exercise.

## Hosted and offline use

Opening the hosted page sends an ordinary web request to GitHub Pages. GitHub states that it logs visitors' IP addresses for security, including for visitors who are not signed in. Local hashing does not mean anonymous hosting. [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection) · [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)

The downloaded HTML can run offline. Its license and AI notice are included inside the file. Opening an external guide, repository or other web link uses the network and the destination's terms and privacy practices apply.

## Reports and contributions

Public GitHub issues and pull requests are visible to others. Use synthetic examples and omit evidence files, credentials and personal details. GitHub processes submissions under its service policies. For a confidential concern, ask the maintainer for a private contact route without posting the confidential content. Report vulnerabilities using [SECURITY.md](SECURITY.md). [Project maintainer](https://github.com/flaritycat)

This description does not determine the obligations of an organization using the tool to handle someone else's data. That organization must assess its own purpose, authority, storage and sharing arrangements.
