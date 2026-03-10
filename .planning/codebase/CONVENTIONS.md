# Coding Conventions

**Analysis Date:** 2026-03-10

## Naming Patterns

Files:

- Pattern: kebab-case for source filenames and CLI commands
  - Examples: `src/create/create.ts`, `src/create/preset/create-preset.ts`, `src/build/build-tsc.ts`

Functions:

- Pattern: camelCase for free functions and helpers
  - Examples: `replaceTokensInFile` in `src/utils/file-utils.ts`, `createPresetTemplate` in `src/create/preset/create-preset.ts`

Variables:

- Pattern: camelCase for local variables and constants; use `const` when value is not reassigned
  - Examples: `destPath`, `camelizedName` in `src/create/shape/create-shape.ts`

Types / Interfaces:

- Pattern: PascalCase for interfaces and type names
  - Examples: `ReplaceTokensOptions`, `ReplaceTokensData` in `src/utils/file-utils.ts`

Exports:

- Pattern: named exports from modules (no default exports observed)
  - Examples: `export async function replaceTokensInFiles` in `src/utils/file-utils.ts`

## Code Style

Formatting:

- Prettier is used via the package `prettier` and project config referenced in `package.json` (`prettier": "@tsparticles/prettier-config"`).
  - Scripts: `prettify:src`, `prettify:readme`, `prettify:ci:src` in `package.json`

Linting:

- ESLint is configured in `eslint.config.js` and reuses `@tsparticles/eslint-config` (see `eslint.config.js`).
  - Scripts: `lint` (auto-fix) and `lint:ci` in `package.json`
  - Rule note: `no-console` is disabled in `eslint.config.js` to allow `console` usage in CLI code and tests.

TypeScript:

- Strict TypeScript settings are enabled in `tsconfig.json` (many `strict` flags set: `strict`, `noImplicitAny`, `noUnusedLocals`, etc.).

Doc comments:

- Use JSDoc/TSDoc style comments on exported functions and complex helpers.
  - Examples: function headers in `src/utils/string-utils.ts`, `src/utils/template-utils.ts`.

## Import Organization

- Pattern observed: third-party packages first, then Node built-ins, then local relative imports.
  - Example from `src/create/preset/create-preset.ts`:
    - `import { camelize, capitalize, dash } from "../../utils/string-utils.js";`
    - `import fs from "fs-extra"`; `import path from "node:path"`;

Path aliases:

- Not detected. Imports use relative paths (e.g., `../../utils/*`) and explicit `.js` extension when imported from tests or other ESM contexts.

## Error Handling

- Pattern: functions either throw synchronous errors (`throw new Error(...)`) for validation or reject Promises when asynchronous operations fail.
  - Example: `getDestinationDir` throws `new Error("Destination folder already exists and is not empty")` in `src/utils/file-utils.ts`.
  - Example: `runInstall`/`runBuild` use the `exec` callback to `reject(error)` in `src/utils/template-utils.ts`.

## Logging

- Pattern: CLI code and tests use `console` for informational output and debugging. ESLint `no-console` is turned off to permit this.
  - Files: `src/cli.ts`, tests in `tests/*.test.ts` (see `tests/file-utils.test.ts` where `console.log`/`console.error` is used).

## Comments and Documentation

- Public helpers include JSDoc comments (examples in `src/utils/*`). Maintain comments for exported functions to describe parameters and return values.

## Function & Module Design

- Small single-responsibility functions are the norm (examples: `replaceTokensInFiles`, `updatePackageFile`, `copyEmptyTemplateFiles`).
- Modules export multiple named helpers rather than a default export (see `src/utils/template-utils.ts`).

## Barrel files

- Not used. Individual modules are imported with relative paths.

---

_Convention analysis: 2026-03-10_
