# Technology Stack

**Analysis Date:** 2026-03-10

## Languages

**Primary:**

- TypeScript 5.x (project uses `typescript` ^5.9.3) - used across CLI source under `src/` (`src/**/*.ts`). See `package.json` and `tsconfig.json` (`package.json`: `dependencies`/`devDependencies`, `tsconfig.json`: `compilerOptions`).

**Secondary:**

- JavaScript (Node ESM runtime output in `dist/` / CLI entry `dist/cli.js`) - `package.json` `type: "module"` and `bin` field (`package.json`).

## Runtime

**Environment:**

- Node.js (ES module, NodeNext resolution). CI workflows use Node 24 (`.github/workflows/node.js-ci.yml`). `tsconfig.json` `module: "NodeNext"`, `target: "ESNext"`.

**Package Manager:**

- pnpm (project declares `packageManager: "pnpm@10.32.0"` in `package.json`, lock file `pnpm-lock.yaml` present).
- Lockfile: `pnpm-lock.yaml` (present).

## Frameworks

**Core:**

- None web-framework-specific. This is a CLI application built with Node and TypeScript. CLI command framework: `commander` (`package.json` -> `dependencies`), commands live in `src/cli.ts`, `src/build/*`, `src/create/*`.

**Testing:**

- Vitest (`vitest` ^4.x) - config file: `vitest.config.ts`, tests located in `tests/*.test.ts`.

**Build/Dev:**

- TypeScript compiler (`tsc`) is used for building (`scripts.build:ts*` in `package.json`, `tsconfig.json` and `src/tsconfig.json`).
- Prettier for formatting (configured via dependency `@tsparticles/prettier-config` referenced in `package.json`). Prettier is run by `src/build/build-prettier.ts` and scripts in `package.json`.
- ESLint (`eslint`) with `@tsparticles/eslint-config` - linting run in `src/build/build-eslint.ts` and via `package.json` scripts.
- Webpack used for bundling (dependency `webpack`, `swc-loader`, `@swc/core`) - bundling logic in `src/build/build-bundle.ts`.
- dependency-cruiser used for circular dependency checks - config `.dependency-cruiser.cjs` and script `circular-deps` in `package.json`.

## Key Dependencies

**Critical:**

- `typescript` ^5.9.3 - primary language toolchain (`package.json`).
- `commander` ^14.x - CLI command framework (`src/cli.ts`, `package.json`).
- `fs-extra` ^11.x - filesystem utilities used widely (`src/utils/file-utils.ts`, `package.json`).
- `prettier` ^3.8.x - formatting; project references `@tsparticles/prettier-config` (`package.json`).
- `eslint` ^10.x and TypeScript ESLint tooling (`package.json`, `src/build/build-eslint.ts`).

**Infrastructure / Build:**

- `webpack` ^5.x, `swc-loader`, `@swc/core` - bundling and fast transpilation (`package.json`, `src/build/build-bundle.ts`).
- `vitest` ^4.x - test runner (`vitest.config.ts`, `package.json`).
- `klaw` - used by prettier tooling to walk folders (`src/build/build-prettier.ts`).

**Utilities:**

- `prompts` - interactive prompts used in templates/generator code (`package.json`, `src/create/*`).
- `lookpath` - used to detect `git` presence in `src/utils/file-utils.ts`.

## Configuration

**Environment:**

- No project-level `.env` files detected. The CLI uses the local environment (executes `git` where available). See `src/utils/file-utils.ts` (calls `lookpath("git")` and runs `git config --get remote.origin.url`).

**Build:**

- TypeScript config: `tsconfig.json` (root) and `src/tsconfig.json` (per-source) - `module: NodeNext`, `target: ESNext`, strict compiler options.
- Linting config is provided by `@tsparticles/eslint-config` (referenced in `package.json`). A dependency-cruiser configuration is present at `.dependency-cruiser.cjs`.
- Prettier config is supplied via `@tsparticles/prettier-config` and `package.json` scripts rely on `src/build/build-prettier.ts`.

## Platform Requirements

**Development:**

- Node.js >= 24 recommended (CI uses Node 24 in `.github/workflows/node.js-ci.yml`).
- pnpm >= 10.x (project `packageManager` sets `pnpm@10.32.0`).
- Git CLI for repository URL resolution used by templates (`src/utils/file-utils.ts`).

**Production / Publishing:**

- Packages are published to npm registry (see `.github/workflows/npm-publish.yml`). The CI uses GitHub Actions and OIDC for auth when publishing (`.github/workflows/npm-publish.yml`).

---

_Stack analysis: 2026-03-10_
