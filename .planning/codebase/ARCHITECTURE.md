# Architecture

**Analysis Date:** 2026-03-10

## Pattern Overview

Overall: Small modular CLI application organized as command modules with utility libraries and build tooling.

Key Characteristics:

- Single-process Node.js CLI built in TypeScript (compiled to ESM JavaScript).
- Commands are organized as independent modules and registered with a central `commander`-based entrypoint.
- Clear separation between "command" code (user-facing CLI actions) and utilities (I/O, template manipulation, subprocess execution).
- Build scripts live under `src/build` and are implemented as programmatic build tasks callable from `build` command.

## Layers

Command Layer:

- Purpose: Exposes CLI commands and their behaviors to end users.
- Location: `src/cli.ts`, `src/create/*`, `src/build/*`
- Contains: `commander` Command instances, argument parsing, user prompts.
- Depends on: `src/utils/*` for filesystem and template operations, `prompts` for interactive input.
- Used by: CLI entrypoint `src/cli.ts` registers commands for runtime.

Core/Template Layer:

- Purpose: Implement the core operations that create projects and manipulate templates.
- Location: `src/create/preset/create-preset.ts`, `src/create/shape/create-shape.ts`, `src/create/plugin/create-plugin.ts`, `src/utils/template-utils.ts`, `src/utils/file-utils.ts`
- Contains: file copy, token replacement, package.json updates, npm execution, webpack/package dist adjustments.
- Depends on: `fs-extra`, `lookpath`, child_process `exec`.
- Used by: Command actions in `src/create/*`.

Build Tooling Layer:

- Purpose: Project build and CI helpers exposed as `build` command.
- Location: `src/build/*.ts` (`src/build/build.ts`, `src/build/build-tsc.ts`, `src/build/build-bundle.ts`, etc.)
- Contains: tasks to run prettier, eslint, tsc, bundling and other project checks.
- Depends on: dev tooling in `package.json` and runtime tools (SWC, Webpack, etc.).

Utilities Layer:

- Purpose: Shared helpers for string manipulation, file operations and token replacement.
- Location: `src/utils/string-utils.ts`, `src/utils/file-utils.ts`, `src/utils/template-utils.ts`
- Contains: helper functions with small focused responsibilities (e.g., `replaceTokensInFile`, `getDestinationDir`, `getRepositoryUrl`).

Test Layer:

- Purpose: Unit tests for templates and generator functions.
- Location: `tests/*.test.ts`, `vitest.config.ts`

## Data Flow

Create command flow (example `preset`):

1. User invokes CLI: `tsparticles-cli create preset <destination>` -> `src/cli.ts` boots and routes to `src/create/create.ts` -> `src/create/preset/preset.ts`.
2. `preset.ts` gathers interactive input via `prompts` and computes `destPath` using `src/utils/file-utils.ts:getDestinationDir`.
3. `createPresetTemplate` in `src/create/preset/create-preset.ts` runs sequence:
   - copy empty template files (`src/utils/template-utils.ts:copyEmptyTemplateFiles`) -> uses `files` templates under repo
   - copy project-specific files via `fs.copy`
   - run a series of `replaceTokensInFile` operations (`src/utils/file-utils.ts`) to customize bundle/index/readme/package files
   - run `runInstall` and `runBuild` (`src/utils/template-utils.ts`) which spawn subprocesses (`npm install`, `npm run build`) if `npm` found

State Management:

- Stateless CLI operations. Functions operate on input parameters and filesystem state. There is no in-memory application-wide state beyond individual command execution.

## Key Abstractions

Command Module:

- Purpose: Encapsulate a single CLI command and its action handler.
- Examples: `src/create/preset/preset.ts`, `src/create/shape/shape.ts`, `src/create/plugin/plugin.ts`, `src/create/create.ts`.
- Pattern: Each command is a `commander.Command` with `argument` declarations and an `action` async function.

Template Manipulation Utility:

- Purpose: Replace tokens and patch files in a project template.
- Examples: `src/utils/file-utils.ts` (`replaceTokensInFile`, `replaceTokensInFiles`), `src/utils/template-utils.ts` (`updatePackageFile`, `updateWebpackFile`).

Build Task Modules:

- Purpose: Implement discrete build subtasks called from `src/build/build.ts`.
- Examples: `src/build/build-tsc.ts`, `src/build/build-bundle.ts`, `src/build/build-eslint.ts`.

## Entry Points

CLI Entrypoint:

- Location: `src/cli.ts`
- Triggers: Executed when package binary `dist/cli.js` is run (shebang present); `npm run build` ensures `dist/cli.js` is executable.
- Responsibilities: Read package version (`package.json`), register `build` and `create` commands and parse `process.argv`.

Create Command Aggregator:

- Location: `src/create/create.ts`
- Triggers: Registered by `src/cli.ts` as `create` command
- Responsibilities: Add subcommands `plugin`, `preset`, `shape` from their respective modules.

Build Aggregator:

- Location: `src/build/build.ts`
- Triggers: Registered by `src/cli.ts` as `build` command
- Responsibilities: Compose and run smaller build tasks (prettier, lint, tsc, circular deps, dist packaging).

## Error Handling

Strategy: Throw and bubble errors from async functions; top-level command handlers are async and do not wrap all exceptions. Some tests and callers catch errors for logging.

Patterns:

- Synchronous validation: `getDestinationDir` checks destination existence and throws an Error if folder not empty (`src/utils/file-utils.ts:getDestinationDir`).
- Subprocess execution: `exec` wrappers (`runInstall`, `runBuild`) return Promises and reject on `exec` error; calling code awaits and therefore receives the rejection (`src/utils/template-utils.ts`).
- Tests catch and log errors selectively (`tests/*.test.ts`), but many command entrypoints do not add global try/catch.

## Cross-Cutting Concerns

Logging:

- Approach: Minimal; code uses `console.error` in tests. No centralized logger present. Files: `tests/*`, most modules do not log.

Validation:

- Approach: Input validation is enforced by `prompts` validators and `getDestinationDir` pre-checks. See `src/create/*` for validators on required fields.

Authentication:

- Approach: Not applicable to this CLI: no remote APIs or credential storage.

---

_Architecture analysis: 2026-03-10_
