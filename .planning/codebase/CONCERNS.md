# Codebase Concerns

**Analysis Date:** 2026-03-08

## Tech Debt

1. Minimal input validation and transactional safety when writing files

- Issue: `replaceTokensInFiles` and other template-updating functions perform read/replace/write in-place without atomic writes or rollback. A failed intermediate step can leave partially updated files.
- Files: `src/utils/file-utils.ts`, `src/utils/template-utils.ts`, `src/create/shape/create-shape.ts`
- Impact: Corrupted template output when an operation fails mid-flow; harder to recover from errors.
- Fix approach: Write to temporary files and rename atomically (use `fs-extra` `outputFile` + `move`), or create the target in a staging directory and move into destination once all transformations succeed.

2. Running external commands directly in template flow (`npm install`, `npm run build`)

- Issue: `runInstall` and `runBuild` call `exec("npm install")` and `exec("npm run build")` without timeouts or stdout/stderr piping; they rely on `lookpath` only.
- Files: `src/utils/template-utils.ts` (functions `runInstall`, `runBuild`)
- Impact: Tests or CI running on environments lacking `npm` may silently skip or hang if `lookpath` returns true but command misbehaves; poor control over failure modes.
- Fix approach: Use spawned child process with streaming logs and a configurable timeout, or provide a dry-run flag. In tests, mock these exec calls to avoid long-running operations.

3. Prettier plugin compatibility workaround

- Issue: `src/build/build-prettier.ts` contains a TODO disabling Prettier check for `prettier-plugin-multiline-arrays` compatibility with Prettier 3.0.0.
- Files: `src/build/build-prettier.ts` (line with TODO)
- Impact: Formatting checks may be inconsistent across CI and local dev environments.
- Fix approach: Update dependencies to versions compatible with Prettier 3.x or pin Prettier to a compatible 2.x in CI until plugins are updated. Add a CI check that fails early with a clear error message.

## Known Bugs

None detected by static analysis in the repository. Tests pass in CI (workflow present) but no failing patterns discovered in code scan.

## Security Considerations

1. Running external commands with user-provided template inputs

- Risk: If destination paths or template tokens contain malicious content, shell commands executed via `exec` could be abused.
- Files: `src/utils/template-utils.ts` (`runInstall`, `runBuild`), `src/utils/file-utils.ts` (token replacement using regex from code, not user input directly).
- Current mitigation: `exec` is invoked with static commands (`npm install`) and not interpolated with user-supplied strings. `replaceTokensInFile` uses regex replacements defined in code.
- Recommendation: Avoid invoking shell with interpolated user input. If needed, sanitize inputs and prefer `spawn` with argument arrays.

2. Reading git remote URL via `exec` in `getRepositoryUrl`

- Risk: `exec` result is returned directly; if git not present it rejects.
- Files: `src/utils/file-utils.ts` (`getRepositoryUrl`)
- Recommendation: Wrap with timeout and sanitize output before using it in template substitution.

## Performance Bottlenecks

1. Synchronous/serial file traversal in prettify

- Problem: `prettier` formatting in `prettifySrc` iterates files sequentially (`for await (const file of klaw(srcPath))`), performing `prettier.resolveConfig` per file which may be expensive.
- Files: `src/build/build-prettier.ts`
- Cause: Recomputing config and formatting each file sequentially.
- Improvement path: Resolve config once outside the loop, run formatting in parallel batches, and avoid repeated IO for options.

## Fragile Areas

1. Regex-based token replacement

- Files: `src/utils/file-utils.ts`, `src/utils/template-utils.ts`, `src/create/*` token replacement usage
- Why fragile: Regexes operate on file contents and can unintentionally match similar substrings; no schema validation after replacement.
- Safe modification: Add tests for each token replacement case, and perform replacements against structured JSON (for `package.json`) using AST parsing where possible.
- Test coverage: Token replacement used heavily but tests exercise many flows; add more unit tests for edge cases.

## Scaling Limits

Not applicable: CLI scaffolding and local build tool; not intended for high-concurrency server workloads.

## Dependencies at Risk

1. Prettier plugin `prettier-plugin-multiline-arrays`

- Risk: Incompatibility with Prettier 3.x noted in `src/build/build-prettier.ts` TODO.
- Impact: Formatting and CI checks could be disrupted.
- Migration plan: Upgrade plugin or pin Prettier; monitor plugin releases.

## Missing Critical Features

1. No centralized logging or telemetry

- Problem: Uses `console.*` directly; no centralized structured logs for debugging CI or for library consumers.
- Blocks: Advanced observability and consistent log levels.

## Test Coverage Gaps

1. Lack of mocks for external process execution

- What's not tested: Behavior of `runInstall`/`runBuild` when `npm` present and when the commands fail.
- Files: `src/utils/template-utils.ts` and tests in `tests/` currently avoid actually running `npm` by relying on environment; but there are no unit tests mocking `exec`.
- Risk: Breakage during publish/cmd execution might not be caught in unit tests.
- Priority: Medium — add tests that stub `child_process.exec` and `lookpath` to verify behavior on success and failure.

2. Token replacement edge cases

- What's not tested: Regex collisions and JSON-encoded fields in `package.json` and `package.dist.json` replacements.
- Files: `src/utils/file-utils.ts`, `src/utils/template-utils.ts`
- Risk: Incorrect package metadata produced for scaffolds.
- Priority: High — add unit tests that run replacements on fixture files with edge-case tokens.

---

_Concerns audit: 2026-03-08_
