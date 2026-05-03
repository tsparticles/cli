# Technology Stack

**Analysis Date:** 2026-03-08

Overview

- This repository is a tooling/config monorepo for tsParticles. It is TypeScript-first and built with Nx + pnpm workspaces, using Nx Release for versioning/publishing. Primary code is in `packages/*`.

1) Languages
- Primary: TypeScript (5.9.x). Evidence: `packages/*/src/**/*.ts`, `packages/tsconfig/package.json` and `pnpm-lock.yaml` entries for `typescript@5.9.3`.

2) Runtime & Package Manager
- Node.js (CI uses Node 24). See `/.github/workflows/node.js-ci.yml` (step `actions/setup-node@v6` with `node-version: '24'`).
- Package manager: pnpm (root `package.json` contains `"packageManager": "pnpm@10.31.0"`). Lockfile: `pnpm-lock.yaml` (repo root).

3) Monorepo & Orchestration
- Nx (workspace): configured via `nx.json` and used by scripts in root `package.json` (e.g. `pnpm run build` calls `nx run-many -t build`). Files: `nx.json`, root `package.json`.
- Nx Release: release/publish automation present in root `package.json` and used by CI (`pnpm exec nx release publish --skip-version`). File: root `package.json`.

4) Build systems & bundlers
- Webpack ^5 (package: `packages/webpack-config` — `packages/webpack-config/package.json`, sources `packages/webpack-config/src/webpack-tsparticles.ts`).
- swc (`@swc/core`) + `swc-loader` used in `packages/webpack-config` (see `packages/webpack-config/package.json`).
- tsup used for building `packages/depcruise-config` (see `packages/depcruise-config/package.json` `compile: tsup`).
- tsc is used in some packages (e.g. `packages/eslint-config/package.json` `build` runs `tsc`).

5) Linting & Formatting
- ESLint config package: `packages/eslint-config` (`packages/eslint-config/src/eslint.config.ts`, `packages/eslint-config/package.json`).
- Prettier config package: `packages/prettier-config` (`packages/prettier-config/package.json`).

6) Key dependencies (where declared)
- `typescript@5.9.3` — root `package.json` devDependencies and `pnpm-lock.yaml`.
- `nx@^22.5.x` — root `package.json` devDependencies and `nx.json`.
- `webpack@^5.x` — `packages/webpack-config/package.json`.
- `@swc/core` & `swc-loader` — `packages/webpack-config/package.json`.
- `tsup` — `packages/depcruise-config/package.json`.

7) Configuration files & important paths
- `package.json` (root) — workspace manifest and scripts.
- `pnpm-lock.yaml` (root) — lockfile.
- `nx.json` (root) — Nx configuration and Nx Cloud runner settings.
- `packages/*/package.json` — per-package manifests (examples: `packages/webpack-config/package.json`, `packages/eslint-config/package.json`).
- `packages/eslint-config/src/eslint.config.ts` — ESLint flat config source.
- `packages/tsconfig/src/tsconfig.json` — reusable TypeScript configs.

8) CI / Releases
- GitHub Actions workflows in `/.github/workflows/`:
  - `/.github/workflows/node.js-ci.yml` — CI build: checks out, sets Node 24, installs pnpm, runs `pnpm install`, then `npx nx affected -t build:ci`.
  - `/.github/workflows/npm-publish.yml` — publishes packages on tags using `pnpm exec nx release publish --skip-version` (OIDC via `actions/setup-node`).
- Both workflows initialize Nx Cloud (`npx nx-cloud start-ci-run`) and expect `NX_CLOUD_ACCESS_TOKEN` in secrets.

9) Local development & common commands
- Install deps: `pnpm install`
- Build all packages: `pnpm run build` (root) -> runs `nx run-many -t build`
- CI build (locally): `npx nx affected -t build:ci`
- Lint per package: `pnpm --filter @tsparticles/webpack-plugin run lint`
- Publish (manual): `pnpm exec nx release publish --skip-version` (CI automates this)

10) Notable scripts (examples)
- Root `package.json` scripts (file: `package.json`):
  - `build`: `nx run-many -t build`
  - `build:ci`: `nx run-many -t build:ci`
  - `version:alpha`: `nx release version prerelease --preid=alpha`

11) Observations
- No runtime application code, servers, or DBs. Repository focuses on build tools and config packages used by main tsParticles monorepo.

---

*Stack analysis: 2026-03-08*
