# Coding Conventions

**Analysis Date:** 2026-03-08

This repository is a TypeScript monorepo of build / config utilities. The project-level conventions are enforced by shared config packages included under `packages/` and by CI. Follow the rules below when adding or editing code.

1) Language & Tooling
- Primary language: TypeScript (see `packages/tsconfig/src/tsconfig.base.json` and `packages/tsconfig/src/tsconfig.json`).
- Compiler strictness: `strict: true`, `noImplicitAny`, `noUnusedLocals` and `useUnknownInCatchVariables` are enabled (see `packages/tsconfig/src/tsconfig.base.json`).

2) Formatter: Prettier
- Project Prettier config: `packages/prettier-config/src/prettier-config.json`.
- Key settings: `printWidth: 120`, `endOfLine: lf`, `tabWidth: 2`, `arrowParens: avoid` (applies to JS/TS/MD etc.).
- Use the package `@tsparticles/prettier-config` in package.jsons (see `packages/prettier-config/package.json`).

3) Linting: ESLint
- Central ESLint configuration is published at `packages/eslint-config/src/eslint.config.ts` and consumed via `eslint.config.js` files in packages (see `packages/depcruise-config/eslint.config.js` and `packages/webpack-config/eslint.config.js`).
- Key style rules enforced (representative list from `packages/eslint-config/src/eslint.config.ts`):
  - Double quotes for strings (`@stylistic/quotes`: `double`) but allow template literals and avoid-escape.
  - Always use semicolons (`@stylistic/semi: always`).
  - Arrow parens: `as-needed` (`@stylistic/arrow-parens`).
  - No `console` (rule `no-console: error`) — prefer structured logging or throw errors.
  - No `var`, prefer `const`/`let` (`no-var`, `prefer-const`).
  - Sorted imports enforced (`sort-imports` config in ESLint). Keep import member order tidy.
  - `@typescript-eslint` suite enforces strict typing: no `any`, explicit return types on functions, no floating promises, no-unused-vars with `_` ignore prefixes. See `packages/eslint-config/src/eslint.config.ts` for the full ruleset.

4) Naming & Exports
- Files: follow kebab-case for package-level files and directories (existing packages use `packages/<package-name>`). Source `*.ts` files follow camelCase and PascalCase for types/classes.
- Functions & variables: camelCase. Types, interfaces and classes: PascalCase.
- Module exports: prefer named exports. If creating a package entrypoint, use the `exports` field in that package's `package.json` (see `packages/depcruise-config/package.json` for example).

5) Code structure & member ordering
- Member ordering for classes/interfaces is enforced by ESLint (`@typescript-eslint/member-ordering`) — follow the ordering defined in `packages/eslint-config/src/eslint.config.ts`.

6) Error handling and catch blocks
- `useUnknownInCatchVariables` is enabled in TypeScript config. Catch variables should be typed safely:

  // Acceptable pattern (use unknown and narrow)
  try {
    // ...
  } catch (e: unknown) {
    if (e instanceof Error) {
      // handle Error
    } else {
      // fallback handling
    }
  }

- Throw only Error instances (ESLint rule `@typescript-eslint/only-throw-error` is enabled). Do not throw primitives.

7) Logging
- `console` usage is disallowed by `no-console`. Use package-level logging utilities if present in a package, or throw errors and return structured results. If you must log for scripts, gate logging behind a flag and avoid leaving `console` in committed library code.

8) Commit messages and release conventions
- This workspace uses Nx Release for automated changelogs and prerelease workflows (see root `package.json` scripts: `version:alpha` and `version:beta`). Use conventional commit messages when bumping versions or creating releases.
  - See `package.json` at repository root for the Nx Release scripts.

9) Scripts & CI
- Lint and format scripts are defined per-package. Examples:
  - `packages/eslint-config/package.json` scripts: `lint` and `lint:ci` (see `packages/eslint-config/package.json`).
  - `packages/depcruise-config/package.json` contains `lint`, `prettify` and `build` scripts (see `packages/depcruise-config/package.json`).
- CI workflow is defined in `.github/workflows/node.js-ci.yml` and runs `npx nx affected -t build:ci`. Keep build targets and linting fast and deterministic for CI.

10) Patterns to follow / avoid
- Follow: small pure functions, explicit types, prefer composition over inheritance, dependency injection for configs where useful.
- Avoid: `any` types, console-based debugging left in committed code, throwing non-Error values, deep nested ternaries (ESLint `no-nested-ternary`), unused variables (ignored only with `_` prefix).

11) Where to find and reuse configs
- ESLint shareable config: `packages/eslint-config/src/eslint.config.ts` and package `@tsparticles/eslint-config` (`packages/eslint-config/package.json`).
- Prettier config: `packages/prettier-config/src/prettier-config.json` and package `@tsparticles/prettier-config` (`packages/prettier-config/package.json`).
- TS configs: `packages/tsconfig/src/tsconfig.base.json` and other variants in `packages/tsconfig/src/`.

If you are adding a new package, consume these shareable configs in the package `package.json` and add `lint`/`prettify` scripts similar to `packages/depcruise-config/package.json`.

*Convention analysis: 2026-03-08*
