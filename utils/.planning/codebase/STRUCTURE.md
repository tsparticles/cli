# Codebase Structure

**Analysis Date:** 2026-03-08

## Directory Layout (top-level)

```
[project-root]/
├── .github/                 # CI workflows and GitHub configuration
├── .nx/                     # Nx internal cache & workspace data (generated)
├── packages/                # Public packages (each is an npm package)
│   ├── webpack-config/      # Webpack related build helpers & presets
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── depcruise-config/    # dependency-cruiser config helper
│   │   ├── src/
│   │   ├── tsup.config.ts
│   │   └── package.json
│   ├── eslint-config/       # shared ESLint configuration
│   ├── prettier-config/     # shared Prettier configuration
│   └── tsconfig/            # shared TypeScript compiler configurations
├── nx.json                  # Nx configuration and task defaults
├── pnpm-workspace.yaml      # Workspace package globs
├── package.json             # Root workspace scripts and release config
└── .planning/               # Generated mapping docs (this folder)
```

## Directory Purposes

**`.github/`**:
- Purpose: CI pipeline definitions. Key file: ` .github/workflows/node.js-ci.yml`.

**`.nx/`**:
- Purpose: Nx internal cache and state (generated). Not committed as source of truth but present in this repo. Examples: `.nx/workspace-data/project-graph.json`.

**`packages/`**:
- Purpose: Contains all publishable packages. Each package follows a consistent layout and lifecycle.
- Contains: `package.json`, source under `src/`, build config (`tsup.config.ts` or `tsconfig.json`), and `dist/` produced by build.
- Key packages and files:
  - `packages/webpack-config/package.json` — publishable webpack helpers
  - `packages/depcruise-config/src/index.ts` — entry point for depcruise helper
  - `packages/eslint-config/src/eslint.config.ts` — ESLint flat config
  - `packages/prettier-config/src/` — Prettier config files
  - `packages/tsconfig/src/` — TypeScript base `tsconfig` files

**Root files**:
- `package.json` — defines workspaces, root scripts (`build`, `build:ci`) and Nx Release commands.
- `pnpm-workspace.yaml` — workspace package glob (includes `packages/*`).
- `nx.json` — Nx configuration controlling default targets, outputs and caching. See `nx.json` lines configuring `build`, `build:ci`, and outputs to `{projectRoot}/dist`.

## Notable Files and Roles

- `packages/depcruise-config/src/index.ts` — implementation entry for dependency-cruiser helper. (See `packages/depcruise-config/package.json` for scripts like `compile` using `tsup`.)
- `packages/webpack-config/src/` — multiple build helpers and templates; `package.json` exposes `main: dist/webpack-tsparticles.js`.
- `packages/eslint-config/src/eslint.config.ts` — holds the ESLint flat config used across packages.
- `.github/workflows/node.js-ci.yml` — sets Node version (`node-version: '24'`), installs pnpm, runs `npx nx affected -t build:ci`.

## Dependency Boundaries

- Internal dependencies should reference other local packages via workspace protocol or plain package name: packages already use `workspace:` references (for devDependencies) as seen in `packages/depcruise-config/package.json` (`"@tsparticles/eslint-config": "workspace:^3.1.9"`).
- Packages are designed to be independent; cross-package dependencies should be explicitly declared in `package.json` as either `dependencies` or `devDependencies`.
- Nx uses affected detection to only build packages impacted by changes. See `nx.json` `targetDefaults` and `.github/workflows/node.js-ci.yml` usage of `npx nx affected`.

## Conventions for Adding New Modules / Features

1. Create a new folder under `packages/` named with the package name: `packages/<new-package>/`.
2. Add a `package.json` with `name`, `version`, `main`, `module`, `types`, `files: ["dist"]`, and `scripts` for `build`, `build:ci`, `lint` and `prepack` consistent with other packages. Use existing packages as examples: `packages/depcruise-config/package.json` and `packages/webpack-config/package.json`.
3. Implement source in `packages/<new-package>/src/` and ensure TypeScript configuration exists (`tsconfig.json`) or rely on the shared `@tsparticles/tsconfig` package.
4. Add build script using `tsup` or `tsc` consistent with package type (see `scripts.compile` in `packages/depcruise-config/package.json`).
5. Add the package to the workspace (no change needed if `pnpm-workspace.yaml` uses `packages/*`).
6. Run `pnpm install` and `npx nx run-many -t build` or `pnpm build` from root to validate.

Recommended file templates and examples:
- Minimal `package.json` example: replicate fields in `packages/depcruise-config/package.json` (scripts: `lint`, `compile`, `build`).
- Build output: `packages/<new-package>/dist/` — ensure `package.json.files` lists `dist`.

## Tests and Build Outputs

- Testing: This repository primarily contains tooling packages; there are no test runner configuration files at root (no detected `jest.config.*` or `vitest.config.*`). If adding tests, follow standard patterns and colocate tests under `packages/<pkg>/src/__tests__/` or `packages/<pkg>/test/` and add `test` scripts in that package's `package.json`.
- Build outputs: `packages/<pkg>/dist/` for each package. Nx caches outputs according to `nx.json` (`outputs: ["{projectRoot}/dist"]`).

## Naming & Layout Conventions

- Package directories: kebab-case under `packages/` (examples: `depcruise-config`, `webpack-config`).
- Source files: prefer `src/` folder with TypeScript modules. Entry points named `index.ts`.
- Config files: `tsconfig.json`, `tsup.config.ts`, and linters located at package root.

## Where to Add New Code

- New utility functions used across packages: create new package under `packages/` if it's intended to be shared; otherwise add to the consuming package's `src/utils/`.
- New build presets or templates: add under `packages/webpack-config/src/` and extend public API in `packages/webpack-config/package.json` `main` file.

## Special Directories

- `.nx/` — generated, should be ignored by consumers (used by Nx). Do not edit.
- `.planning/` — mapping docs generated by repository analysis. Committed for planning.

---

*Structure analysis: 2026-03-08*
