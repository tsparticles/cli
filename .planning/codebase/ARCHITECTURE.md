# Architecture

**Analysis Date:** 2026-03-08

## Pattern Overview

Overall: Monorepo for developer tooling and shared configs built and orchestrated with Nx + pnpm workspaces, with Nx Release for publishing.

Key characteristics:
- Package-per-concern layout: each directory under `packages/` is an independently versioned npm package (examples: `packages/webpack-config`, `packages/depcruise-config`, `packages/eslint-config`).
- Build artifacts are produced into `dist/` inside each package and exposed via `package.json` fields (`main`, `module`, `types`). See `packages/webpack-config/package.json` and `packages/depcruise-config/package.json`.
- Orchestration and caching are handled by Nx (configuration in `nx.json`) and CI integrates with Nx Cloud. See `nx.json` and `.github/workflows/node.js-ci.yml`.

This repository is a tooling/configuration library workspace; there is no application server runtime. The runtime of interest is the Node.js build/test environment used by CI and local developers.

## High-level Components

- Workspace root:
  - `package.json` (root) — workspace settings and root scripts: `build`, `build:ci`, and Nx Release flows. See `package.json` at repo root.
  - `pnpm-workspace.yaml` — workspace package globs (includes `packages/*`).
  - `nx.json` — Nx defaults and task configuration. See `nx.json` for `build`, `build:ci` defaults and `outputs` config.

- Packages (examples):
  - `packages/webpack-config/` — webpack presets, templates and build helpers. Source: `packages/webpack-config/src/` (see `packages/webpack-config/src/webpack-tsparticles.ts`, `packages/webpack-config/src/common/getConfig.ts`).
  - `packages/depcruise-config/` — helper library for dependency-cruiser. Source: `packages/depcruise-config/src/index.ts`, `packages/depcruise-config/src/loadConfig.ts`.
  - `packages/eslint-config/` — shared ESLint configuration. Source: `packages/eslint-config/src/eslint.config.ts`.
  - `packages/prettier-config/` — Prettier config package. Source: `packages/prettier-config/src/prettier-config.json`.
  - `packages/tsconfig/` — TypeScript base configurations. Source: `packages/tsconfig/src/tsconfig.base.json` and others.

- CI & publishing:
  - `.github/workflows/node.js-ci.yml` — CI flow that installs pnpm, runs `npx nx affected -t build:ci` and uses Nx Cloud.
  - `.github/workflows/npm-publish.yml` — publishing automation (present in repo).

## Layers

Logical layers in this repo:

1. Authoring layer — TypeScript sources in `packages/<pkg>/src/` (examples: `packages/webpack-config/src/`, `packages/depcruise-config/src/`).
2. Build layer — per-package build scripts (e.g. `tsup`, `tsc`, `cpx`) defined in each package's `package.json` or `tsup.config.ts` (see `packages/depcruise-config/tsup.config.ts`, `packages/webpack-config/tsconfig.json`).
3. Distribution layer — compiled artifacts in `packages/<pkg>/dist/` published to npm.

Files and locations:
- Sources: `packages/<pkg>/src/*` (e.g. `packages/depcruise-config/src/index.ts`)
- Build configs: `packages/<pkg>/tsup.config.ts`, `packages/<pkg>/tsconfig.json` (present for `depcruise-config` and `webpack-config`).
- Outputs: `packages/<pkg>/dist/` (artifact consumers import from paths noted in `package.json` `main`/`module`).

## Data Flow / Release Flow

High-level flow for change → package publication:

1. Developer edits `packages/<pkg>/src/*` (e.g. `packages/webpack-config/src/templates/buildTemplate.ts`).
2. Local/CI: `pnpm install` then `npx nx run-many -t build` or `npx nx affected -t build:ci` (CI uses affected detection). See `.github/workflows/node.js-ci.yml`.
3. Package build scripts (`tsup`, `tsc`, `cpx`) produce `packages/<pkg>/dist/` and `package.json` normally lists `dist` in `files`.
4. Publishing uses Nx Release flows defined in root `package.json` (scripts `version:alpha`/`version:beta`, `publish:alpha`/`publish:beta`) or CI `npm-publish` workflow.

ASCII diagram (simplified):

Repository root
  ├─ packages/<pkg>/src/  --(build)--> packages/<pkg>/dist/  --(publish)--> npm
  └─ nx orchestrates builds and caching (see `nx.json`)

## Runtime Topology

This repo does not host long-running network services. Runtime elements are developer/CI environments:

- Node.js used in CI: configured in `.github/workflows/node.js-ci.yml` (example: `node-version: '24'`).
- Package manager: `pnpm` (see root `package.json` `packageManager: "pnpm@10.31.0"`).
- Nx provides task orchestration and caching (`nx.json`).

## Key Abstractions

- Package boundary: Each `packages/<name>/` directory is the primary abstraction. Key files per package include:
  - `packages/<name>/package.json` — public interface and scripts.
  - `packages/<name>/src/` — implementation (e.g. `packages/depcruise-config/src/index.ts`).
  - `packages/<name>/dist/` — build output consumed by downstream projects.
- Nx targets: `build`, `build:ci`, `prepare`, `package` configured via `nx.json` `targetDefaults` and package `package.json` scripts.

## Entry Points

- Per-package entry points are declared in `packages/<pkg>/package.json` through `main`, `module`, `types` fields. Examples:
  - `packages/webpack-config/package.json` → `main: dist/webpack-tsparticles.js`.
  - `packages/depcruise-config/package.json` → `main: dist/index.cjs`, `module: dist/index.js`.
- Root-level orchestration scripts: `package.json` at repository root includes `build` and `build:ci` that call Nx: `nx run-many -t build` (see `package.json`).

## Error Handling & Observability

- Error handling is limited to build and CI errors surfaced by tooling. There is no application-level error handling in package source code.
- CI observability: `.github/workflows/node.js-ci.yml` includes Nx Cloud start/stop steps and CI logs are available through GitHub Actions and Nx Cloud. See `.github/workflows/node.js-ci.yml`.

## Cross-cutting Concerns

- Linting and formatting are centralized into internal packages: `packages/eslint-config` and `packages/prettier-config` (see `packages/eslint-config/src/eslint.config.ts`, `packages/prettier-config/src/prettier-config.json`).
- TypeScript configuration is shared via `packages/tsconfig` (see `packages/tsconfig/src/tsconfig.base.json`).

## Short Component Diagram (ASCII)

[dev machine] -- pnpm install --> [workspace root]
  |-- `packages/webpack-config/src` --build--> `packages/webpack-config/dist`
  |-- `packages/depcruise-config/src` --build--> `packages/depcruise-config/dist`
  `-- nx orchestrates (see `nx.json` & `.github/workflows/node.js-ci.yml`)

---

*Architecture analysis: 2026-03-08*
