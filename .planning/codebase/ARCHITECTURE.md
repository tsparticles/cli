# Architecture Overview

## High-level Patterns

- CLI-first architecture: entry point in `src/cli.ts` and various commands under `src/create/` and `src/build/`.
- Code is organized by feature (create, build, files) rather than strict layers.
- Emphasis on small, focused scripts that can be composed (see `src/build/*`).

## Layers & Responsibilities

- Entry: `src/cli.ts` — argument parsing and command dispatch.
- Features: `src/create/`, `src/build/` — implement commands and business logic.
- Utilities: `src/utils/*` — shared helpers (file, string, template utils).
- Templates: `files/` — project templates and file scaffolding used by create commands.

## Data Flow

- CLI receives user input → dispatches to feature handlers → feature handlers manipulate file system and templates → build/test steps run as scripts.

## Entry Points

- `src/cli.ts` — main executable logic.
- `package.json` scripts — convenience wrappers used by CI and local dev.

## Important files

- `src/create/create.ts` — glue for create subcommands
- `src/build/build.ts` — orchestrates build steps
- `files/` — scaffold templates worth inspecting for generated project expectations
