# Codebase Concerns

**Analysis Date:** 2026-03-10

## Tech Debt

**Regex-based token replacement (critical):**

- Issue: `src/utils/file-utils.ts` implements `replaceTokensInFiles` and constructs a RegExp with `new RegExp(token.from, "g")` regardless of whether `token.from` is a `string` or a `RegExp`.
- Files: `src/utils/file-utils.ts`, callers in `src/utils/template-utils.ts`, `src/create/preset/create-preset.ts` (many tokens are passed as `RegExp` literals).
- Impact: When `token.from` is already a `RegExp` and flags are passed as the second argument to `RegExp` constructor, Node throws a TypeError. This makes token replacement fragile and causes runtime exceptions in template updates. Tests and callers may swallow the error (see `tests/create-preset.test.ts`) so the issue can be silent in CI but still indicate a bug.
- Fix approach: Update `replaceTokensInFiles` to detect `RegExp` values and use them directly, or construct a `RegExp` only when `token.from` is a string. Example change in `src/utils/file-utils.ts`:

```ts
const regex = token.from instanceof RegExp ? token.from : new RegExp(String(token.from), "g");
data = data.replace(regex, token.to);
```

Applying this fix ensures RegExp arguments are respected and avoids TypeErrors.

**Template JSON changes performed with regex (moderate):**

- Issue: `src/utils/template-utils.ts` updates `package.json` and `package.dist.json` using regex replacements (`replaceTokensInFile`) instead of reading and writing JSON.
- Files: `src/utils/template-utils.ts`, `src/create/preset/create-preset.ts`.
- Impact: Regex-based edits are brittle: formatting differences, comments, CRLF vs LF, or unexpected matches can break JSON structure or fail to update fields correctly.
- Fix approach: Parse the JSON files with `fs.readJSON` / `fs.writeJSON` and modify the relevant fields (name, description, repository, files). This is more robust and easier to test. Example target: update `updatePackageFile` to `const pkg = await fs.readJSON(pkgPath); pkg.name = packageName; await fs.writeJSON(pkgPath, pkg, { spaces: 2 });`

## Known Bugs

**RegExp constructor TypeError during replacements:**

- Symptoms: Token replacement throws TypeError when token pattern is a `RegExp` and code calls `new RegExp(token.from, "g")`.
- Files: `src/utils/file-utils.ts` (replacement implementation).
- Trigger: Calling any create/template flow that passes `RegExp` literals into tokens (e.g., `src/create/preset/create-preset.ts`).
- Workaround: Tests and callers often wrap calls in try/catch (see `tests/create-preset.test.ts`) so tests still assert package.json existence, masking the problem. Do not rely on that; fix the replacement implementation.

## Security Considerations

**Arbitrary script execution via `npm install` / `npm run build`:**

- Area: `src/utils/template-utils.ts` functions `runInstall` and `runBuild` execute `npm install` and `npm run build` in generated projects.
- Files: `src/utils/template-utils.ts`, `src/create/*` where `runInstall` and `runBuild` are invoked (e.g., `src/create/preset/create-preset.ts`).
- Risk: Running `npm install` in a directory containing an attacker-controlled `package.json` can execute lifecycle scripts (postinstall, preinstall). The CLI currently runs installs automatically during template creation, which can execute arbitrary code on the user's machine.
- Current mitigation: `lookpath("npm")` is used to avoid running when `npm` is not available, but this does not mitigate script execution risks.
- Recommendation: Do not run `npm install` / `npm run build` automatically. Instead:
  - Require an explicit flag (e.g., `--install`) to run automatic installs, or
  - Use `npm ci --ignore-scripts` or `npm install --ignore-scripts` as a safer default, and clearly warn users before running scripts, or
  - Prompt for confirmation before running `npm` and print the exact command being run.

## Performance Bottlenecks

**Use of `child_process.exec` for long-running, high-output commands (moderate):**

- Area: `src/utils/template-utils.ts` and `src/utils/file-utils.ts` (the latter uses `exec` in `getRepositoryUrl`).
- Files: `src/utils/template-utils.ts` (`runInstall`, `runBuild`), `src/utils/file-utils.ts` (`getRepositoryUrl`).
- Problem: `exec` buffers the full stdout/stderr and has a default buffer size; heavy outputs (e.g., `npm install`) can overflow the buffer and cause the subprocess to fail. Also, using `exec` hides streaming logs from the user.
- Improvement path: Use `child_process.spawn` with streaming of stdout/stderr and proper error/exit-code handling. Stream logs to the console or into a logger so users see progress.

## Fragile Areas

**Broad regex replacements over multiple file types (fragile):**

- Files: `src/utils/file-utils.ts`, call sites in `src/utils/template-utils.ts` and `src/create/*`.
- Why fragile: Replacing text with global regexes across files risks accidental substitution (e.g., replacing occurrences in unrelated files). It also makes reasoning about what changed difficult.
- Safe modification: Limit replacements to specific files and, where possible, use structured transforms (JSON AST edits for `package.json`, templating tools for code files) rather than blind regex.

**No centralized logging or structured errors (minor):**

- Files: `src/cli.ts`, `src/build/*.ts`, `src/create/*` — modules log via `console` or propagate exceptions.
- Why fragile: Lack of a central logger and consistent error formatting makes debugging and user-facing error messages inconsistent. Adding a simple logging utility (e.g., `src/utils/logger.ts`) and top-level error handling in `src/cli.ts` would improve UX.

## Dependencies at Risk

**Self-referential devDependency:**

- Files: `package.json` lists `"@tsparticles/cli": "latest"` in `devDependencies`.
- Risk: This can lead to confusing local development semantics. It is common for monorepo setups but should be intentional.
- Migration plan: If not required, remove the self-reference. If needed for local testing, ensure a documented developer workflow.

## Missing Critical Features

**Safe-by-default template creation (missing):**

- Problem: Template creation runs `npm install`/`npm run build` by default. There is no opt-in flag to skip these actions for safer, faster creation in CI or sandboxed environments.
- Blocks: CI runs, offline usage, and security-conscious users.
- Recommendation: Add a `--no-install` / `--skip-install` option to `create` commands or a top-level config, and ensure `runInstall`/`runBuild` respect that option.

## Test Coverage Gaps

**Replacement function tests (high priority):**

- What's not tested: `replaceTokensInFiles` behavior when `token.from` is a `RegExp` object vs a `string` (no explicit unit tests for this edge case).
- Files: `src/utils/file-utils.ts`, tests should be added under `tests/file-utils.test.ts` or similar.
- Risk: Future regressions and silent failures in template flows.
- Priority: High — add targeted unit tests that exercise both `string` and `RegExp` token inputs and verify no exceptions are thrown and replacements occur as expected.

**Integration tests should avoid running real npm:**

- What's not tested safely: `createPresetTemplate` currently calls `runInstall` and `runBuild` which invoke `npm` and may perform network operations in CI.
- Files: `tests/create-preset.test.ts`, `src/utils/template-utils.ts`.
- Recommendation: Mock `lookpath` and `child_process.exec` in tests, or refactor `runInstall`/`runBuild` to accept an injectable runner (dependency injection) so tests can inject a no-op runner.

---

_Concerns audit: 2026-03-10_
