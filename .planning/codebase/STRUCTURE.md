# Codebase Structure

**Analysis Date:** 2026-03-10

## Directory Layout

```
[project-root]/
├── src/                 # TypeScript source for CLI and build tasks
│   ├── cli.ts           # CLI entrypoint (registers commands)
│   ├── create/          # "create" command and subcommands
│   │   ├── create.ts
│   │   ├── plugin/
│   │   │   ├── plugin.ts
│   │   │   └── create-plugin.ts
│   │   ├── preset/
│   │   │   ├── preset.ts
│   │   │   └── create-preset.ts
│   │   └── shape/
│   │       ├── shape.ts
│   │       └── create-shape.ts
│   ├── build/           # Build helper commands/tasks
│   │   ├── build.ts
│   │   ├── build-tsc.ts
│   │   ├── build-bundle.ts
│   │   └── ...
│   └── utils/           # Shared utilities
│       ├── file-utils.ts
│       ├── template-utils.ts
│       └── string-utils.ts
├── files/               # Template files used by generators (not under src/ but referenced)
├── tests/               # Vitest unit tests
├── dist/                # Compiled ESM output (generated)
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── .planning/           # Mapping and planning docs
```

## Directory Purposes

**src/**:

- Purpose: Source code for the CLI tool and internal build tasks.
- Contains: Command modules (`src/create/*`), build tasks (`src/build/*`), utilities (`src/utils/*`).
- Key files: `src/cli.ts`, `src/create/create.ts`, `src/create/preset/create-preset.ts`.

**src/create/**:

- Purpose: Implements the `create` command and its subcommands.
- Contains: `plugin`, `preset`, `shape` subfolders each exposing a `Command` instance and a template-creation implementation (`create-*.ts`).
- Key files: `src/create/preset/preset.ts`, `src/create/preset/create-preset.ts`.

**src/build/**:

- Purpose: Build and CI helper tasks used by `pnpm run build` and `build` CLI command.
- Contains: modular build steps: `build-prettier.ts`, `build-eslint.ts`, `build-tsc.ts`, bundling helpers.
- Key files: `src/build/build.ts` (aggregator), `src/build/build-tsc.ts`.

**src/utils/**:

- Purpose: Shared helpers for filesystem operations, string handling, and template updates.
- Contains: `file-utils.ts` (`replaceTokensInFile`, `getDestinationDir`), `template-utils.ts` (`runInstall`, `runBuild`, `updatePackageFile`).

**files/**:

- Purpose: Template projects that are copied into new destinations by `create` commands.
- Note: Referenced by `src/create/*` code via relative paths (e.g., `path.join(__dirname, "..", "..", "files", "create-preset")` in `src/create/preset/create-preset.ts`).

**tests/**:

- Purpose: Unit tests using Vitest for template creation behavior.
- Contains: `tests/create-shape.test.ts`, `tests/create-preset.test.ts`.

## Key File Locations

Entry Points:

- `src/cli.ts`: boots the program, reads package version from `package.json`, registers `build` and `create` commands.

Create commands:

- `src/create/create.ts`: aggregates subcommands.
- `src/create/preset/preset.ts`: CLI surface for `preset` command.
- `src/create/preset/create-preset.ts`: implementation that writes files and runs install/build.

Utilities:

- `src/utils/file-utils.ts`: token replacement helpers and repository detection.
- `src/utils/template-utils.ts`: file copying, package updates and running `npm` commands.

Build tasks:

- `src/build/build.ts`: orchestration of build steps called both in CI and local `pnpm run build`.

## Naming Conventions

Files:

- Pattern: kebab-case for file names that represent commands or grouped concerns (e.g., `create-preset.ts`, `build-tsc.ts`).
- Source modules are TypeScript (`.ts`) compiled to ESM JS in `dist/`.

Directories:

- Pattern: singular, descriptive names (`create`, `build`, `utils`, `files`).

## Where to Add New Code

New Feature (CLI command):

- Primary code: add a new command module under `src/<feature>/` or create a subcommand under `src/create/`.
- Registration: register the new `Command` in `src/cli.ts` or in `src/create/create.ts` for `create`-subcommands.
- Tests: add unit tests under `tests/` following existing patterns (`tests/<feature>.test.ts`).

New Utility:

- Implementation: add new helper in `src/utils/` and export named functions; reuse in command modules.
- Examples: `src/utils/new-util.ts` and update `src/utils/index.ts` (if created) to re-export it.

Templates and Files:

- Add new templates under `files/` and reference them from create implementations using `path.join(__dirname, "..", "..", "files", "<template>")`.

## Special Directories

dist/:

- Purpose: Compiled ESM output for packaging and the `bin` entry (`dist/cli.js`).
- Generated: Yes
- Committed: No (should be generated during build)

tests/tmp-files/:

- Purpose: Tests write temporary projects into `tests/tmp-files/*` during execution and remove them afterwards (see `tests/*.test.ts`).

---

_Structure analysis: 2026-03-10_
