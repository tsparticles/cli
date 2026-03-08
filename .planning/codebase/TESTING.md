# Testing Patterns

**Analysis Date:** 2026-03-08

## Test Framework

**Runner:**

- Vitest (`vitest`) - configured in `vitest.config.ts` with `environment: "node"` and `include: ["tests/**/*.test.ts"]`.

Config: `vitest.config.ts`

Run Commands:

```bash
pnpm test              # Run all tests (runs `vitest run` as defined in package.json)
pnpm test --watch      # Run in watch mode (Vitest supports --watch)
pnpm test --coverage   # Coverage if configured via vitest options (not explicitly configured here)
```

## Test File Organization

Location:

- Tests live under `tests/` at the repo root: `tests/*.test.ts` (e.g., `tests/create-shape.test.ts`, `tests/file-utils.test.ts`).

Naming:

- Test files use the pattern `<feature>.test.ts` (Vitest `include` config picks `tests/**/*.test.ts`).

Structure:

```
tests/
├── create-shape.test.ts
├── create-preset.test.ts
├── create-plugin.test.ts
├── file-utils.test.ts
└── string-utils.test.ts
```

## Test Structure

Suite Organization (example from `tests/create-shape.test.ts`):

```ts
import { describe, it, expect } from "vitest";
import { createShapeTemplate } from "../src/create/shape/create-shape.js";

describe("create-shape", () => {
  it("should have created the shape project", async () => {
    // arrange: compute destDir
    // act: call createShapeTemplate
    // assert: read package.json and assert properties using fs-extra
  });
});
```

Patterns:

- Tests create temporary directories under `tests/tmp-files` and remove them after assertions (`fs-extra` used to clean up).
- Tests use actual file system operations to verify template creation (integration-style unit tests).

Setup/Teardown:

- Tests manually create and remove directories within each test case (no global setup file detected).

## Mocking

Framework: Vitest built-in mocking utilities are available but not heavily used in current tests.

Patterns:

- Tests primarily exercise filesystem operations without mocking `fs-extra` or child processes. When external commands are invoked, the code checks for the presence of `npm` using `lookpath` before running `exec` which avoids executing if not present.

What to Mock:

- When adding unit tests for functions that call `exec` or modify the environment, mock `child_process.exec` or `lookpath` to avoid running external processes.

What NOT to Mock:

- For integration-style tests that verify file scaffolding, prefer real `fs` operations in a temporary directory to validate end-to-end behavior.

## Fixtures and Factories

Test Data:

- Tests programmatically generate temporary directories under `tests/tmp-files` and use template functions to create artifacts. No centralized fixtures directory is present.

Location:

- Temporary test artifacts are created in `tests/tmp-files` during tests and cleaned up by tests (see `tests/create-shape.test.ts`).

## Coverage

Requirements: None enforced in repo. CI runs `pnpm test` but coverage thresholds are not configured.

View Coverage:

```bash

```

## Test Types

Unit Tests:

- Small utilities tested (e.g., `tests/file-utils.test.ts`, `tests/string-utils.test.ts`).

Integration Tests:

- Template creation tests behave like integration tests, performing file operations and validating outputs (`tests/create-*.test.ts`).

E2E Tests:

- Not used.

## Common Patterns

Async Testing:

```ts
it("does async work", async () => {
  await expect(someAsyncFn()).resolves.toBeTruthy();
});
```

Error Testing:

```ts
it("throws on bad input", async () => {
  await expect(badAsync()).rejects.toThrow();
});
```

---

_Testing analysis: 2026-03-08_
