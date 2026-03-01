# Directory Structure

## Top-level layout

- `src/` — application source code (CLI, create/build commands, utilities)
- `files/` — template projects and scaffolding used by create commands
- `.github/` — CI workflows and GitHub configuration
- `package.json`, `pnpm-lock.yaml`, `tsconfig.json` — project metadata and config

## Key directories and purpose

- `src/create/` — commands that scaffold projects or generate content (`preset`, `plugin`, `shape` folders inside)
- `src/build/` — build scripts and bundlers (`build.ts`, `build-tsc.ts`, `build-bundle.ts`, etc.)
- `src/utils/` — utility functions used across the codebase (`file-utils.ts`, `template-utils.ts`, `string-utils.ts`)
- `files/create-plugin/` and `files/create-shape/` — template sources for generated plugins and shapes

## Conventions

- Files written in TypeScript (.ts) with small modules per responsibility.
- Tests configured with Vitest (`vitest.config.ts`).

## Where to start when exploring

1. `src/cli.ts` to see CLI commands and flags
2. `src/create/create.ts` and `src/build/build.ts` to see main flows
3. `files/` to understand generated project expectations
