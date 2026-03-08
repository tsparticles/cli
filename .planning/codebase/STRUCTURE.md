# Codebase Structure

**Analysis Date:** 2026-03-08

## Directory Layout

```
[project-root]/
├── src/                 # TypeScript source for the CLI
│   ├── build/           # Build command implementations and helpers
│   ├── create/          # Create command implementations (preset, plugin, shape)
│   └── utils/           # Shared utilities (file, template, string helpers)
├── files/               # Template files used by create commands
├── tests/               # Vitest unit tests for utilities and create flows
├── dist/                # Build output (generated, should be ignored)
├── package.json         # NPM package config and scripts
├── pnpm-lock.yaml       # Lockfile for pnpm
├── tsconfig.json        # TypeScript compiler options
└── .github/workflows/   # CI and publish workflows
```

## Directory Purposes

**`src/`**:

- Purpose: Primary implementation in TypeScript.
- Contains: `src/cli.ts`, `src/build/*`, `src/create/*`, `src/utils/*`.
- Key files: `src/cli.ts` (entry), `src/create/create.ts`, `src/build/build.ts`, `src/utils/file-utils.ts`.

**`files/`**:

- Purpose: Scaffolding templates used by the create commands.
- Contains: `files/create-shape`, `files/create-preset`, `files/create-plugin`, `files/empty-project`.

**`tests/`**:

- Purpose: Unit tests executed by `vitest`.
- Contains: tests validating template creation and utility behavior (e.g., `tests/create-shape.test.ts`, `tests/file-utils.test.ts`).

**`dist/`**:

- Purpose: Output of compilation/build process. Generated; not committed.

## Key File Locations

**Entry Points:**

- `src/cli.ts`: CLI program creation and command registration.

**Configuration:**

- `package.json`: scripts, dependencies, package metadata.
- `tsconfig.json`: TypeScript configuration.
- `vitest.config.ts`: Test runner configuration.

**Core Logic:**

- `src/utils/file-utils.ts`: token replacement, destination directory checks, git repository lookup.
- `src/utils/template-utils.ts`: template transformers, copy helpers, npm build/install invocations.

**Commands:**

- `src/create/*`: `src/create/create.ts`, `src/create/preset/*`, `src/create/plugin/*`, `src/create/shape/*`.
- `src/build/*`: `build.ts`, `build-prettier.ts`, `build-bundle.ts`, `build-tsc.ts`, `build-eslint.ts`, `build-distfiles.ts`, `build-diststats.ts`.

## Naming Conventions

Files:

- Kebab-case for templates/files under `files/`.
- Source files in `src/` use `camelCase` or `kebab-case` depending on purpose; commands grouped into directories named by feature.

Directories:

- Feature directories under `src/` (e.g., `create`, `build`, `utils`).

## Where to Add New Code

New Feature (command):
New Component/Module:

- Implementation: `src/utils/` for shared helpers, or `src/<feature>/` if feature-specific.
- Export public helpers from their files; avoid adding global side-effects.

Utilities:

- Shared helpers: `src/utils/`.
- If utility is generic, add tests in `tests/` and export clearly-typed interfaces.

## Special Directories

`files/`:

- Purpose: Template assets for project scaffolding.
- Generated: No
- Committed: Yes

`tests/`:

- Purpose: Contains unit tests. Committed: Yes

---

_Structure analysis: 2026-03-08_
