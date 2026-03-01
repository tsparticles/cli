# External Integrations

## Datastores & Persistence

- No direct database code in this repository; primary focus is CLI tooling. If external storage is used by generated projects, it's not present here.

## APIs & Services

- GitHub Actions and npm registry used for CI/CD and publishing (`.github/workflows/` and `npm-publish.yml`).
- GitHub (repository) for releases and package publishing.

## Authentication & Secrets

- No runtime auth libraries are used in this codebase. Secrets may appear in CI environment variables; check `.github/workflows/` for references.

## Webhooks & Third-party Integrations

- The repository includes templates for project files (`files/`) but does not implement outgoing webhooks.

## Where to look

- `.github/workflows/` — CI configuration and publishing steps.
- `package.json` — scripts that call external tools and registries.

## Notes

- This project integrates primarily with developer tooling and registries rather than external runtime services.
