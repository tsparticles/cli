# External Integrations

**Analysis Date:** 2026-03-10

## APIs & External Services

This project is a local CLI tool focused on scaffolding and building tsParticles-related packages. There are minimal external service integrations.

**Repository / Git:**

- Git: CLI uses the `git` binary when available to obtain repository URL (`src/utils/file-utils.ts` uses `lookpath("git")` and executes `git config --get remote.origin.url`). No other GitHub API integration detected.

**NPM Registry:**

- Publishing: GitHub Actions workflow publishes packages to npm registry (`.github/workflows/npm-publish.yml`) using `pnpm publish` against `https://registry.npmjs.org`.
  - Auth: CI uses OIDC/GitHub Actions environment for authentication as configured in `.github/workflows/npm-publish.yml` (permissions include `id-token: write`).

## Data Storage

**Databases:**

- Not detected. The CLI operates on the local filesystem; no database clients (e.g. PostgreSQL, MongoDB) are referenced in `src/`.

**File Storage:**

- Local filesystem via `fs-extra` (`src/utils/file-utils.ts` and many create/template helpers). Templates are copied from `files/*` into target directories (`src/create/*`, e.g. `src/create/plugin/create-plugin.ts` uses `files/create-plugin`).

**Caching:**

- Not detected. No Redis or in-process caching libraries observed.

## Authentication & Identity

**Auth Provider:**

- None for runtime. CI publishes to npm using GitHub Actions OIDC flow (see `.github/workflows/npm-publish.yml`). There are no runtime OAuth or Identity providers integrated into the CLI.

## Monitoring & Observability

**Error Tracking:**

- Not detected. No Sentry, Datadog, or similar SDKs in dependencies.

**Logs:**

- Console logging used throughout the CLI (`console.log`, `console.warn`, `console.error`). See `src/build/*` and `src/create/*` for examples (e.g. `src/build/build.ts`, `src/build/build-prettier.ts`).

## CI/CD & Deployment

**Hosting:**

- NPM registry for package distribution. Source is maintained in GitHub and CI runs on GitHub Actions (`.github/workflows/*`).

**CI Pipeline:**

- GitHub Actions pipelines:
  - `Node.js CI` (`.github/workflows/node.js-ci.yml`) runs on push and PRs to `main`: installs via `pnpm install`, runs `pnpm run build:ci` and `pnpm test`.
  - `Publish Packages` (`.github/workflows/npm-publish.yml`) publishes tags `v*` to npm, using OIDC-based auth and `pnpm publish`.

## Environment Configuration

**Required env vars:**

- Not enforced in repo code. CI publishing relies on GitHub Actions OIDC configured in workflow; no runtime environment variables are required by the CLI itself.

**Secrets location:**

- Not present in repo. CI uses OIDC in the publish workflow. No local secrets files detected (no `.env`).

## Webhooks & Callbacks

**Incoming:**

- Not detected. This is a CLI tool; it does not expose HTTP endpoints.

**Outgoing:**

- Not detected. The CLI does not make outbound HTTP API calls; templates and README files reference public CDNs (jsDelivr) and GitHub URLs but no HTTP client libraries are used.

---

_Integration audit: 2026-03-10_
