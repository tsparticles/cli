# Testing Patterns

**Analysis Date:** 2026-03-10

## Test Framework

Runner:

- Vitest (see `package.json` devDependencies `vitest` and `vitest.config.ts`).
- Config file: `vitest.config.ts` (sets `globals: true`, `environment: "node"`, `include: ["tests/**/*.test.ts"]`).

Run Commands:

```bash
pnpm test              # Runs: `vitest run` (non-watch)
pnpm run test          # Alias to the same command
```

## Test File Organization

Location:

- Tests live in the `tests/` directory at project root.
  - Files: `tests/create-shape.test.ts`, `tests/create-preset.test.ts`, `tests/create-plugin.test.ts`, `tests/file-utils.test.ts`, `tests/string-utils.test.ts`.
- Pattern: tests are colocated under a top-level `tests/` folder rather than next to source files.

Naming:

- Pattern: `*.test.ts` suffix for test files (see `vitest.config.ts` include pattern).

Structure:

```
tests/
├── <feature>.test.ts   # top-level test file for a single module/feature
```

## Test Structure and Patterns

Suite Organization:

- Tests use `describe` blocks to group scenarios and `it` for assertions (Vitest globals enabled). Example: `tests/file-utils.test.ts`.

Setup / Teardown:

- Tests frequently perform async setup at the top-level of `describe` by awaiting operations before `it` blocks. Example: in `tests/file-utils.test.ts` the `baseDir` is created with `await fs.ensureDir(baseDir)` before assertions.
- Teardown uses `afterAll` to remove temporary test artifacts. Example: `afterAll(async () => { await fs.remove(baseDir); });` in `tests/file-utils.test.ts`.

Assertions:

- Vitest's `expect` is used with matchers like `toBe`.

Async Tests:

- Most IO-heavy tests are `async` and use `await`. Pattern:

```typescript
it("does something async", async () => {
  const result = await someAsyncFunction();
  expect(result).toBe(...);
});
```

Error Testing Pattern:

- When verifying exceptions, tests use try/catch with a boolean flag and assert the flag at the end. Example in `tests/file-utils.test.ts`:

```typescript
let ex = false;
try {
  await getDestinationDir(path.join("tmp-files", "baz"));
} catch {
  ex = true;
}
expect(ex).toBe(true);
```

Prefer using `await expect(...).rejects.toThrow()` for clearer intent when adding tests.

## Mocking

Framework:

- No mocking libraries observed; tests perform filesystem operations against a temporary directory (`tests/tmp-files`) and rely on actual `fs-extra` operations.

Patterns:

- Tests use real file operations (create files, write content, call functions under test, assert file contents). Example: `tests/file-utils.test.ts` writes files into `tmp-files` and later reads them.

What to mock / not to mock:

- Current tests intentionally avoid mocking to validate filesystem interactions. Continue to avoid mocking for these utilities unless external network/long-running processes are involved (e.g., `exec` calls in `template-utils.ts` could be mocked if tests should not run `npm install` or `npm run build`).

## Fixtures and Factories

Test Data:

- Tests create temporary files under `tests/tmp-files` using `fs-extra`. Example: `tests/create-shape.test.ts` writes to `tests/tmp-files/foo-shape` and later removes it.

Location:

- Temporary test artifacts are written under `tests/tmp-files/` and removed by test code or CI before/after runs (CI workflow runs `rm -rf tests/tmp-files`). See `.github/workflows/node.js-ci.yml`.

## Coverage

Coverage tool: Not enforced in repo (no explicit coverage script), but `.nyc_output` directory exists suggesting past use of NYC. No CI step collects coverage.

To run coverage (suggested): add a script using `vitest run --coverage` and configure thresholds in `package.json` if required.

## Test Types

Unit Tests:

- Scope: small, deterministic units that interact with filesystem helpers and template generation functions. Examples: `tests/string-utils.test.ts`, `tests/file-utils.test.ts`.

Integration-ish Tests:

- Scope: template creation tests (`tests/create-*.test.ts`) copy files and run `runInstall`/`runBuild` indirectly; these can execute `npm` commands if present (templating functions call `runInstall` and `runBuild` which execute `npm` if `lookpath('npm')` returns true). These tests currently run in CI where `pnpm install` is executed and `npm` may be present.

E2E Tests:

- Not used.

## Common Patterns and Recommendations

1. Use `afterAll` to clean up filesystem artifacts (example: `tests/file-utils.test.ts` removes `baseDir`).
2. Prefer `await expect(promise).rejects.toThrow()` for negative tests instead of boolean-flag try/catch pattern.
3. Keep filesystem-based tests under `tests/tmp-files` and ensure CI cleans them before runs (CI step already removes `tests/tmp-files`). See `.github/workflows/node.js-ci.yml` lines 44-46 and 84-86.
4. If tests should avoid running `npm install`/`npm run build` during template creation, add a test flag or mock `lookpath`/`exec` in `src/utils/template-utils.ts` to bypass `runInstall`/`runBuild` during tests.

## Example Test Template (observed pattern)

```typescript
import { describe, it, expect } from "vitest";
import fs from "fs-extra";
import path from "node:path";
import { someFunction } from "../src/utils/some.ts";

describe("someFunction", () => {
  it("behaves correctly", async () => {
    const dest = path.join(__dirname, "tmp-files", "some");
    await fs.ensureDir(dest);

    await someFunction(dest);

    const data = await fs.readFile(path.join(dest, "file.txt"), "utf8");
    expect(data).toBe("expected");

    await fs.remove(dest);
  });
});
```

---

_Testing analysis: 2026-03-10_
