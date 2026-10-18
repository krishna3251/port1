# AGENTS.md — Portfolio (Static Site)

## Project map
- This is a static portfolio/site built around `index.html`, `style.css`, `script.js`, `boxes.js`, and the assets in the repository.
- Read the existing markup, styles, scripts, and README before editing. Keep changes consistent with the plain HTML/CSS/JavaScript setup.

## Implementation rules
- Prefer small, direct changes over adding a framework or build system.
- Preserve current branding, existing sections, images, cursor/animation behavior, and navigation unless the request explicitly changes them.
- Use semantic HTML, responsive CSS, accessible contrast, keyboard focus styles, and reduced-motion handling where relevant.
- Keep JavaScript defensive when elements are absent; avoid leaking event listeners or adding repeated initialization.
- Keep image paths and asset filenames valid. Do not rename or delete media without checking all references.
- Do not add analytics, remote scripts, trackers, or unrelated external dependencies without a clear requirement.

## Verification
- No test/build script is evident from the root listing; check the repository before assuming one exists.
- Validate HTML/CSS/JS changes with the available tooling and inspect the page at mobile and desktop sizes when possible.
- Review the diff for broken relative paths, accidental asset deletion, and unrelated edits.