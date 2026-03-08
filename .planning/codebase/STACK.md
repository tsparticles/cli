# Technology Stack

**Analysis Date:** 2026-03-08

## Languages

**Primary:**

- TypeScript (>=5.x) - used across the entire codebase in `src/` (e.g. `src/cli.ts`, `src/create/*`, `src/build/*`)

**Secondary:**

- JavaScript (Node) - runtime JS emitted to `dist/` (package `type` set to `module` in `package.json`)

## Runtime

**Environment:**

- Node.js 24 (CI uses `actions/setup-node` with `node-version: "24"` in `.github/workflows/node.js-ci.yml`)

**Package Manager:**

- pnpm (declared in `package.json` via `packageManager`: `pnpm@10.31.0`)
- Lockfile present: `pnpm-lock.yaml`

## Frameworks

**Core:**

- None web-framework specific. This is a CLI application built with Node and TypeScript. Entry point: `src/cli.ts`.

**CLI/Command parsing:**

- `commander` (`src/cli.ts`, `src/create/create.ts`, `src/build/*`) - used to declare commands and subcommands.

**Testing:**

- `vitest` (configured in `vitest.config.ts`, tests in `tests/*.test.ts`)

**Build/Dev:**

- `typescript` for compilation (`tsc -p src`, see `package.json` scripts)
- `webpack` used by some build tasks (see `src/build/build-bundle.ts` importing `webpack`)
- `swc` (`@swc/core`) is listed as dependency (used by some tooling or downstream tasks)

## Key Dependencies

**Critical:**

- `commander` - command-line parsing (`src/cli.ts`)
- `fs-extra` - filesystem utilities used widely (`src/utils/*`, `src/create/*`, `src/build/*`)
- `prettier` - formatting (`src/build/build-prettier.ts`)
- `typescript` - language (dev dependency and build target)

**Infrastructure / Tooling:**

- `prompts` - interactive prompts for the `create` subcommands (`src/create/*`)
- `lookpath` - used to detect external commands (`src/utils/template-utils.ts`, `src/utils/file-utils.ts`)
- `webpack` - bundling (`src/build/build-bundle.ts`)
- `vitest` - testing runner (`tests/*.test.ts`, `vitest.config.ts`)

## Configuration

**Environment:**

- No `.env` usage detected. CI sets Node version and runs pnpm in GitHub workflows (`.github/workflows/*.yml`).

**Build:**

- TypeScript config: `tsconfig.json` (root) and `src/tsconfig.json` included via `eslint.config.js` (parserOptions.project).
- Build scripts are defined in `package.json` (e.g. `pnpm run build`, `pnpm run build:ci`, `pnpm run build:ts:cjs`)

## Platform Requirements

**Development:**

- Node.js 24+, pnpm (v10+), git - used by scripts and utilities (`src/utils/file-utils.ts` uses `git` if available)

**Production / Distribution:**

- Packaged as npm package (`publishConfig` in `package.json` and `npm-publish` workflow). Outputs are placed under `dist/` and CLI binary `dist/cli.js` (`bin` in `package.json`).

---

_Stack analysis: 2026-03-08_
