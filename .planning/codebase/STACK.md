# Project Technology Stack

## Overview

This document summarizes the primary languages, runtimes, frameworks and key dependencies used by the project.

## Languages & Runtimes

- TypeScript (primary language) — code under `src/`
- Node.js runtime for CLI tooling and build scripts

## Frameworks & Tools

- bun / pnpm / npm used in CI and local development (see `package.json`)
- Vite / esbuild / tsc used for builds (see `src/build/`)
- Vitest used for unit tests (`vitest.config.ts`)

## Key Dependencies (examples)

- `typescript` — type checking and compilation
- `prettier` / `eslint` — formatting and linting (see `eslint.config.js`)
- `@types/node` — Node typings

## Configuration locations

- `package.json` — dependency declarations
- `tsconfig.json` and `src/tsconfig.json` — TypeScript config
- `.github/workflows/` — CI config

## How to inspect

1. Open `package.json` to inspect top-level dependencies.
2. Look at `src/build/` for build scripts and bundling logic.
3. Check `vitest.config.ts` for test runner configuration.

## Notes

- This repository focuses on CLI tooling and code generation utilities located in `src/` and `files/`.
