# Testing Patterns

**Analysis Date:** 2026-03-08

Scope: This repository contains tooling packages and shared configs (ESLint, Prettier, tsconfig, webpack presets). There is no central test runner configuration at the repository root. This document summarizes how tests should be added and the conventions used across the packages.

1) Current state (test tooling present / absent)
- No top-level `jest.config.*`, `vitest.config.*`, or `mocha` configuration files detected at repository root.
- There are no files matching `*.test.*` or `*.spec.*` in the repository root or packages (grep found none). The repository is primarily published config packages with build/lint scripts.

2) Suggested / observed test frameworks
- Since this is a TypeScript monorepo and the packages are small, prefer `vitest` or `jest` for unit tests. The project currently has no explicit runner, but CI runs `npx nx affected -t build:ci` (see `.github/workflows/node.js-ci.yml`) and per-package `build` scripts run `prettier`, `eslint` and `tsup`/`tsc`.

3) Where tests should live (recommended)
- Co-locate tests with implementation using a `__tests__` folder or alongside files using `.test.ts` naming. Example locations:
  - `packages/<package>/src/__tests__/myutil.test.ts`
  - `packages/<package>/test/myutil.test.ts`

4) Package scripts pattern
- Follow existing packages as examples. `packages/depcruise-config/package.json` defines scripts for formatting and linting; add test scripts following this pattern:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
  - `"test:ci": "vitest run --coverage"`

5) Test structure and examples
- Unit tests: keep isolated, fast and deterministic. Example structure for a typical unit test (TypeScript + Vitest):

  // Example pattern for a synchronous helper test
  import { myHelper } from '../myHelper';

  describe('myHelper', () => {
    it('returns expected value for normal input', () => {
      expect(myHelper(1)).toBe(2);
    });
  });

- For packages that produce compiled output (e.g., `packages/depcruise-config`), tests can import from the `src` files (TS) so type-checking covers tests as well.

6) Mocking & fixtures
- Use lightweight mocking with `vi.fn()` or `jest.fn()` depending on runner. Avoid heavy integration-level tests unless necessary for bundles.
- Place fixtures under `packages/<package>/test/fixtures/` or `packages/<package>/src/__fixtures__/`.

7) Running tests locally and in CI
- Local: add package scripts as above and run `pnpm -w -F <package> test` or run via `npx nx test <project>` if you register `test` targets in Nx project configuration.
- CI: The repository's CI currently focuses on build targets: `.github/workflows/node.js-ci.yml` runs `npx nx affected -t build:ci`. If tests are added, update the CI workflow to run `npx nx affected -t test:ci` or add a new step to run `pnpm -w -r test`.

8) Coverage
- No coverage configuration detected. If using Vitest, add `vitest.config.ts` with `coverage` settings and a script `test:ci` for coverage collection. Store coverage artifacts where CI expects them, and add coverage threshold checks if desired.

9) Test examples from repository
- There are no existing `*.test.*` files to reference. Use `packages/depcruise-config/package.json` as example for script layout and `packages/eslint-config/package.json` for lint/test integration.

10) Recommendations for introducing tests
- Add tests incrementally per-package. For library logic in `packages/webpack-config/src/` or `packages/depcruise-config/src/`, add unit tests under `packages/<pkg>/src/__tests__/` and expose `test` scripts in package.json.
- Register `test` and `test:ci` targets in Nx project configuration so `npx nx affected -t test:ci` can run tests in CI efficiently.

11) Common patterns to follow in tests
- Prefer small, deterministic unit tests that assert pure function outputs.
- Use `describe`/`it` blocks and clear setup/teardown using `beforeEach`/`afterEach` when needed.
- Mock external dependencies (file-system, network) and keep tests offline-ready.

12) Summary
- Tests are not present in this repository currently. When adding tests, conform to the monorepo patterns: co-locate tests, add package scripts, enforce formatting/linting, and register CI targets in `.github/workflows/node.js-ci.yml` to run tests via Nx.

*Testing analysis: 2026-03-08*
