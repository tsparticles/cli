# Known Concerns & Technical Debt

## Areas to watch

- Monorepo/tooling complexity: multiple build scripts and template directories can make onboarding heavier.
- Potential duplication in `src/build/*` scripts — consider centralizing common helpers.

## Security

- No runtime secrets in repo, but CI workflows may reference secrets in GitHub Actions. Review `.github/workflows/*` before changes that touch publishing.

## Performance

- CLI operations that manipulate the filesystem could be slow on large projects; consider batching FS ops or using async utilities from `src/utils/file-utils.ts`.

## Testing gaps

- Look for missing unit tests for some build scripts; ensure important flows have coverage.

## Refactor suggestions

1. Consolidate build step helpers into a single `src/build/utils.ts` to reduce duplication.
2. Add a CONTRIBUTING.md with dev setup steps (install, run tests, lint).
