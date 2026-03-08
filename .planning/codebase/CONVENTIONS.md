# Coding Conventions

**Analysis Date:** 2026-03-08

## Naming Patterns

Files:

- Source files are placed under feature directories (e.g., `src/create/shape/create-shape.ts`). Use descriptive names matching the feature.

Functions:

- Use camelCase for function names (e.g., `createShapeTemplate` in `src/create/shape/create-shape.ts`, `replaceTokensInFile` in `src/utils/file-utils.ts`).

Variables:

- Use camelCase for variables and constants. TypeScript types use PascalCase.

Types:

- Interfaces and types use PascalCase (e.g., `ReplaceTokensOptions`, `ReplaceTokensData` in `src/utils/file-utils.ts`).

## Code Style

Formatting:

- Prettier is the formatting tool; root `package.json` sets `prettier` to `@tsparticles/prettier-config`. Formatting settings are applied in `src/build/build-prettier.ts` (printWidth 120, tabWidth 2, endOfLine lf).

Linting:

- ESLint config in `eslint.config.js` extends `@tsparticles/eslint-config`. Linting is enforced in `package.json` scripts (`lint`, `lint:ci`) and CI runs `pnpm run lint:ci` in `node.js-ci.yml`.

## Import Organization

Order:

1. Node built-ins (e.g., `path`, `fs-extra` import as `fs`)
2. External dependencies (e.g., `commander`, `prompts`)
3. Internal modules (relative imports under `src/`)

Examples: `src/cli.ts` imports `buildCommand` and `createCommand` from local modules after Node imports.

Path Aliases:

- None detected. Imports use relative paths and package names. Keep using relative imports within `src/`.

## Error Handling

Patterns:

- Use try/catch around file system operations and external command execution; log errors with `console.error` (see `src/build/*.ts`, `src/utils/*`).
- Functions that perform operations return boolean success flags (`Promise<boolean>`) where appropriate (e.g., `src/build/build-prettier.ts`, `src/build/build-bundle.ts`).

## Logging

Framework: console

Patterns:

- Use `console.log` for informational messages, `console.warn` for warnings, `console.error` for errors. Follow existing use in `src/build/*` and `src/utils/*`.

## Comments

When to Comment:

- Use JSDoc/TSDoc comments for exported functions and modules. Code contains JSDoc-style function headers (e.g., `src/build/build-prettier.ts`).

JSDoc/TSDoc:

- Use TSDoc/JSDoc annotations for function parameters and return values on public utilities.

## Function Design

Size:

- Functions typically remain under ~200 lines and perform a single responsibility (e.g., `createShapeTemplate` orchestrates template copying and updates but delegates to small helpers).

Parameters:

- Prefer explicit parameters and typed signatures. Existing functions are strongly typed (see `tsconfig.json` with `strict: true`).

Return Values:

- Use typed return values (`Promise<void>`, `Promise<boolean>`) and avoid implicit `any`.

## Module Design

Exports:

- Modules export named functions (e.g., `export async function createShapeTemplate ...` in `src/create/shape/create-shape.ts`). Prefer named exports.
  Barrel Files:
- Not used. Add explicit exports per-file instead of index barrel files unless a clear grouping is required.

---

_Convention analysis: 2026-03-08_
