# Architecture

**Analysis Date:** 2026-03-08

## Pattern Overview

**Overall:** Modular CLI application structured as command modules (command-per-file) with utility layers for filesystem and template operations.

**Key Characteristics:**

- Command-oriented boundaries implemented with `commander` (commands registered in `src/cli.ts` and `src/create/*`, `src/build/*`).
- Utilities are centralized under `src/utils/` for file operations, templating, and string manipulation.
- Build-related logic is under `src/build/` and creation/template generation logic under `src/create/`.

## Layers

**CLI / Entry Layer:**

- Purpose: Expose CLI commands and wiring.
- Location: `src/cli.ts`
- Contains: Program initialization, command registration (`build`, `create`).
- Depends on: `src/build/*`, `src/create/*`.
- Used by: End users invoking the installed binary.

**Command Implementations:**

- Purpose: Implement individual subcommands for build and create flows.
- Location: `src/create/*` (e.g. `src/create/create.ts`, `src/create/preset/*`, `src/create/plugin/*`, `src/create/shape/*`) and `src/build/*` (e.g. `src/build/build.ts`, `src/build/build-*.ts`).
- Contains: Command definitions, argument parsing (uses `commander`), orchestration of utilities.
- Depends on: `src/utils/*` for filesystem and templating, `fs-extra`, `prettier`, `webpack` where needed.

**Utilities / Core Logic:**

- Purpose: Reusable helpers for file operations, token replacement, template manipulation, and string utilities.
- Location: `src/utils/` (`file-utils.ts`, `template-utils.ts`, `string-utils.ts`).
- Contains: `replaceTokensInFile`, `runInstall`, `runBuild`, copy filter helpers, string transforms.
- Depends on: `fs-extra`, `lookpath`, `child_process` (`exec`).

**Files & Templates:**

- Purpose: Template resources used to scaffold projects.
- Location: `files/` (e.g., `files/create-shape`, `files/create-preset`, `files/create-plugin`, `files/empty-project`).

## Data Flow

Create flow (example `create shape`):

1. User runs CLI: `tsparticles-cli create shape <dest>` (`src/cli.ts` -> `src/create/create.ts` -> `src/create/shape/*`).
2. Command handler calls `createShapeTemplate` in `src/create/shape/create-shape.ts`.
3. `createShapeTemplate` copies template files from `files/create-shape` to destination using `fs-extra` and `template-utils.copyEmptyTemplateFiles`.
4. Token replacement and file updates are performed using `src/utils/file-utils.ts` functions like `replaceTokensInFile` and helpers in `src/utils/template-utils.ts`.
5. Optional lifecycle commands `runInstall` and `runBuild` invoke external commands (`npm install`, `npm run build`) via `child_process.exec` if `npm` is present (checked via `lookpath`).

State Management:

- Stateless CLI; state is the filesystem and created project files. No in-memory long-lived state across runs.

## Key Abstractions

**Template Updater:**

- Purpose: Replace tokens and update produced scaffold files.
- Examples: `src/utils/file-utils.ts` (`replaceTokensInFile`), `src/utils/template-utils.ts` (`updatePackageFile`, `updateWebpackFile`, `updatePackageDistFile`).
- Pattern: Imperative token-replacement using regexes and file writes.

**Command Modules:**

- Purpose: Each subcommand is an isolated module exposing a `Command` (from `commander`).
- Examples: `src/create/create.ts`, `src/build/build.ts`, `src/create/shape/create-shape.ts`.

## Entry Points

**CLI Entrypoint:**

- Location: `src/cli.ts`
- Triggers: Node process when user runs `tsparticles-cli` or package `bin` mapping.
- Responsibilities: Read package version (`package.json`), register commands and parse args.

## Error Handling

Strategy:

- Try/catch around file operations and external command execution; errors logged to console with `console.error` and boolean success values returned (e.g., `src/build/*` functions return `Promise<boolean>`). Examples: `src/build/build-prettier.ts`, `src/build/build-bundle.ts`.

Patterns:

- Propagate failures by throwing or returning `false` and logging details.
- `replaceTokensInFiles` performs read/replace/write with no specialized rollback.

## Cross-Cutting Concerns

Logging: `console.log`, `console.warn`, `console.error` used across `src/build/*` and `src/utils/*`.

Validation: Input validation is minimal — `commander` performs CLI argument parsing; `getDestinationDir` validates destination directory emptiness in `src/utils/file-utils.ts`.

Authentication: Not applicable; tool is local and does not call external authenticated services.

---

_Architecture analysis: 2026-03-08_
