# External Integrations

**Analysis Date:** 2026-03-08

Overview

- This repository is a tooling/config monorepo. Integrations are primarily CI/CD, Nx Cloud for distributed caching, and package publishing to npm. No runtime third-party APIs (databases, auth providers, payment gateways) are present in `packages/*`.

1) CI/CD (GitHub Actions)
- Workflow files: `/.github/workflows/node.js-ci.yml`, `/.github/workflows/npm-publish.yml`.
- `node.js-ci.yml` key steps:
  - `actions/checkout@v6` (checkout code)
  - `actions/setup-node@v6` with `node-version: '24'`
  - `pnpm/action-setup@v4.2.0` then `pnpm install`
  - Initialize Nx Cloud: `npx nx-cloud start-ci-run --distribute-on="3 linux-medium-js"`
  - Build affected packages: `npx nx affected -t build:ci`
  - Stop Nx Cloud session: `npx nx fix-ci`
- `npm-publish.yml` key steps:
  - Trigger: `on: push` for tags `v*`
  - Setup Node (Node 24) with `registry-url: https://registry.npmjs.org`
  - Build: `npx nx run-many -t build:ci`
  - Publish: `pnpm exec nx release publish --skip-version` (with alpha/beta tag handling)

2) Nx Cloud (distributed execution & caching)
- Configuration: `nx.json` defines `tasksRunnerOptions.default.runner` = `nx-cloud` and cacheable operations. File: `nx.json`.
- CI workflows set environment variables: `NX_CLOUD_DISTRIBUTED_EXECUTION: true` and pass `NX_CLOUD_ACCESS_TOKEN` from GitHub Secrets. See `/.github/workflows/node.js-ci.yml` and `/.github/workflows/npm-publish.yml` (env section).
- Files referencing Nx Cloud: `nx.json`, `/.github/workflows/node.js-ci.yml`, `/.github/workflows/npm-publish.yml`.

3) Package publishing (NPM via Nx Release)
- Release config: root `package.json` scripts (`version:alpha`, `publish:alpha`, `publish:beta`).
- Publishing workflow: `/.github/workflows/npm-publish.yml` runs `pnpm exec nx release publish --skip-version` and uses OIDC & repository permissions instead of storing long-lived npm tokens in repo.
- Registry: `https://registry.npmjs.org` configured in workflow `actions/setup-node` step.

4) Caching & package manager support
- pnpm store caching in CI: workflows run `pnpm store path` and cache it using `actions/cache@v5` keyed on `**/pnpm-lock.yaml`. See `/.github/workflows/node.js-ci.yml` and `/.github/workflows/npm-publish.yml`.

5) Code quality tooling (packaged configs)
- ESLint: packaged at `packages/eslint-config` and consumed by other packages via `@tsparticles/eslint-config` in `packages/*/package.json`.
- Prettier: packaged at `packages/prettier-config` and referenced as `prettier` field in package manifests.

6) Environment variables & secrets used by integrations
- NX_CLOUD_ACCESS_TOKEN — expected to be stored in GitHub Secrets and injected into workflows (`/.github/workflows/node.js-ci.yml` and `/.github/workflows/npm-publish.yml`). DO NOT commit its value.
- NX_CLOUD_DISTRIBUTED_EXECUTION — exported in workflows to enable distributed execution.
- Standard GitHub Actions env vars used: `GITHUB_REF`, `GITHUB_EVENT_NAME`, etc. — used for tagging logic in `npm-publish.yml`.
- No other third-party API keys or secrets discovered in repo files (no `.env` checked in).

7) Webhooks & callbacks
- None in repository; repository relies on GitHub Actions triggers (`push`, `pull_request`, `push` tags).

8) Observability & monitoring
- No Sentry/Datadog/Prometheus/Splunk integrations found.

9) Where integrations are configured (quick paths)
- GitHub Actions workflows: `/.github/workflows/node.js-ci.yml`, `/.github/workflows/npm-publish.yml`.
- Nx Cloud runner config: `nx.json`.
- Nx Release publish scripts: `package.json` (root).

10) Credentials patterns & cautions
- Secrets are supplied via GitHub Secrets (e.g., `NX_CLOUD_ACCESS_TOKEN`) — verify they are not replicated in source.
- Publishing uses OIDC and repository permissions rather than long-lived npm tokens committed in repo (see `/.github/workflows/npm-publish.yml` `actions/setup-node` usage and `pnpm exec nx release publish --skip-version`).

11) Recommended checks when modifying integrations
- If you change Nx Cloud usage, ensure `NX_CLOUD_ACCESS_TOKEN` remains configured in repository secrets or fallback runner will be used (see `nx.json` tasks runner `local`).
- When adding external API integrations, add env var names to repository README or `.github` docs and DO NOT commit `.env`.

---

*Integration audit: 2026-03-08*
