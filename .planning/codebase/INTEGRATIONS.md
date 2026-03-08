# External Integrations

**Analysis Date:** 2026-03-08

## APIs & External Services

No cloud SDKs (Stripe, AWS, Supabase, etc.) detected in `src/` imports. Searches for common providers returned no matches.

## Data Storage

**Databases:**

- Not detected. No database clients (pg/mysql/mongodb) are imported in `src/`.

**File Storage:**

- Local filesystem via `fs-extra` used throughout (`src/utils/file-utils.ts`, `src/utils/template-utils.ts`, `src/create/*`) to read/write project templates and package files.

**Caching:**

- None detected.

## Authentication & Identity

**Auth Provider:**

- Not applicable. This is a local CLI tool and does not integrate with external auth providers.

## Monitoring & Observability

**Error Tracking:**

- None detected (no Sentry / Datadog / Rollbar SDK imports).

**Logs:**

- Standard console logging (`console.log`, `console.error`, `console.warn`) used throughout build and template utilities (e.g., `src/build/*`, `src/utils/*`).

## CI/CD & Deployment

**Hosting:**

- NPM registry publishes defined in `.github/workflows/npm-publish.yml` (publishes on tags `v*`).

**CI Pipeline:**

- GitHub Actions workflows:
  - `/.github/workflows/node.js-ci.yml` runs on push and pull_request for `main`, executes `pnpm install`, `pnpm run build:ci`, and `pnpm test`.
  - `/.github/workflows/npm-publish.yml` publishes package on version tags using OIDC-based authentication.

## Environment Configuration

**Required env vars:**

- No application runtime env vars detected in source. CI workflows rely on GitHub OIDC and standard GitHub Actions environment variables.

**Secrets location:**

- No secrets files in repo. GitHub publishing uses built-in OIDC and repository permissions configured in the workflow (`id-token: write`).

## Webhooks & Callbacks

**Incoming:**

- None detected.

**Outgoing:**

- None detected.

---

_Integration audit: 2026-03-08_
