# Testing & Quality

## Test Runner

- Vitest is used as the test runner. See `vitest.config.ts` for configuration.

## Test Structure

- Tests are colocated or placed in a `tests/` folder depending on the feature; look for `*.spec.ts` or `*.test.ts` patterns.

## Coverage & CI

- Coverage reported via nyc output observed in `.nyc_output/` (presets or previous runs).
- CI workflows in `.github/workflows/` run tests on push/PR.

## Mocking & Utilities

- Use Vitest's mocking utilities for unit tests. For filesystem operations, prefer using temporary directories or helpers in `src/utils/file-utils.ts`.

## How to run tests locally

1. Install deps: `pnpm install` or `npm install` (project uses pnpm in CI).
