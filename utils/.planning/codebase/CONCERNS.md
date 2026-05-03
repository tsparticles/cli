# Codebase Concerns

**Analysis Date:** 2026-03-08

This document lists technical debt, security and performance concerns, fragile areas, and missing/testing gaps discovered in this repository. Each item is prioritized (High / Medium / Low) and includes concrete file paths and recommended mitigation steps.

1) Missing automated tests and test runner (High)
- Symptom: No unit/integration/e2e test files or `test` scripts are present in the workspace packages.
  - Evidence:
    - No `*.test.*` or `*.spec.*` files found under `packages/` (scan summary in `.planning/codebase/TESTING.md`).
    - Root `package.json` (`./package.json`) scripts lack `test`.
    - `packages/webpack-config/package.json` (`packages/webpack-config/package.json`) and `packages/depcruise-config/package.json` (`packages/depcruise-config/package.json`) do not define `test` scripts.
  - Impact: Regressions and breaking changes can be published without detection; refactors are high-risk.
  - Fix approach:
    - Add a test runner (recommend `vitest` for TypeScript libraries) and add example unit tests in `packages/depcruise-config/src/__tests__` and `packages/webpack-config/src/__tests__`.
    - Add a workspace `test` script to `./package.json` that runs tests across affected projects (e.g., `nx affected -t test` or `pnpm -w test`).
    - Enforce coverage thresholds and run coverage in CI (`vitest --coverage`).

2) CI builds but does not run tests or audits (High)
- Symptom: `.github/workflows/node.js-ci.yml` installs and builds packages but contains no test or vulnerability audit steps.
  - Evidence: `.github/workflows/node.js-ci.yml` runs `pnpm install` and `npx nx affected -t build:ci` and then stops; no test, audit or coverage collection steps are present.
  - Impact: Vulnerable or broken code can reach published packages.
  - Fix approach:
    - Extend `.github/workflows/node.js-ci.yml` to include test job(s) that run unit and integration tests and collect coverage.
    - Add a dependency audit step (`pnpm audit`, Snyk, or similar) and/or scheduled security scans.
    - Add `dependabot` or `renovate` config (`.github/dependabot.yml` or `renovate.json`).

3) No coverage enforcement (Medium)
- Symptom: No coverage tooling or thresholds appear configured.
  - Impact: Coverage regressions can remain unnoticed.
  - Fix approach: Configure coverage reporting in chosen test runner and fail CI if coverage falls below thresholds.

4) Heavy build plugins and dual-output by default in webpack-config (Medium)
- Symptom: `packages/webpack-config/src/common/getConfig.ts` enables `BundleAnalyzerPlugin` by default and generates an unminified + minified build pair for every invocation.
  - Evidence: File: `packages/webpack-config/src/common/getConfig.ts` — lines instantiate `BundleAnalyzerPlugin` and return `[getSingleConfig(params, false), getSingleConfig(params, true)]` (see `getConfig`).
  - Impact: CI and consumer builds are slower; extra artifacts (`report.html`) may be produced unintentionally.
  - Fix approach:
    - Gate heavy plugins behind environment flags or explicit options (e.g., `ANALYZE=true`), in `packages/webpack-config/src/common/getConfig.ts`.
    - Avoid producing both min and non-min outputs by default; produce only requested variants.
    - Add a `fast`/CI mode to skip optional plugins.

5) Compiled artifacts and workspace cache present on disk (Medium)
- Symptom: `dist/` files for `webpack-config` and `.nx` workspace cache data were observed on disk. These files are currently ignored by Git and are needed locally for development builds.
  - Evidence: `packages/webpack-config/dist/common/getConfig.js` exists on disk (not tracked by Git). Repository `.gitignore` contains `packages/webpack-config/dist` and root entries for `.nx/cache` and `.nx/workspace-data`.
  - Impact: Local generated artifacts are fine for development, but they can be accidentally added to commits or confuse searches and code scans if not handled explicitly.
  - Recommended policy & mitigations:
    - Preserve local artifacts if you need them for development — do not remove them before building. Keep `.gitignore` entries in place to prevent accidental commits.
    - Add a short note to the repository README (or `packages/webpack-config/README.md`) that documents the local artifact policy, e.g.:

      "Build outputs (`packages/*/dist`) are generated locally and intentionally ignored by Git. Do not commit generated artifacts; run the package build when needed: `pnpm -w build` or `pnpm --filter <pkg> build`." 

    - Prevent accidental commits using lightweight safeguards:
      - Add a pre-commit hook (Husky or simple script) that refuses `git add`/`commit` of `packages/*/dist/**`.
      - For developers who must retain local, uncommitted changes permanently, use `git update-index --skip-worktree <path>` to avoid showing changes in `git status`.

    - Verify CI/publish does not depend on committed `dist/` artifacts. If any pipeline expects committed build outputs, document that rationale and add CI validation (e.g., `pnpm pack` checks) so the source of truth remains reproducible.

6) Dynamic import of local config files executes code (Medium)
- Symptom: `packages/depcruise-config/src/loadConfig.ts` dynamically imports configuration files discovered in the current working directory using `import(pathToFileURL(fullPath).href)`.
  - Evidence: File: `packages/depcruise-config/src/loadConfig.ts` lines 30-36 perform `await import(...)`.
  - Impact: Running tooling that loads configs from untrusted sources (forked PRs, third-party repos) executes arbitrary code; this is a security risk.
  - Fix approach:
    - Document this behaviour prominently in `packages/depcruise-config/README.md` and any CLI docs.
    - Provide an option to accept only static config formats (JSON) or to execute imports in an isolated process (child process with minimal privileges) when scanning untrusted code.

7) No automated dependency update configuration (Medium)
- Symptom: `pnpm-lock.yaml` present but no Dependabot/Renovate config detected.
  - Evidence: `pnpm-lock.yaml` at repo root; `.github/workflows` do not schedule dependency update jobs.
  - Impact: Transitive vulnerabilities or stale dependencies may persist.
  - Fix approach:
    - Add `.github/dependabot.yml` or a `renovate.json` to enable automated dependency PRs.
    - Add a scheduled `pnpm audit` workflow job and fail CI on high-severity vulnerabilities.

8) Configuration generator packages lack tests (Medium)
- Symptom: Packages that generate config artifacts have little or no unit tests validating generated shapes.
  - Evidence: `packages/eslint-config/src/eslint.config.ts`, `packages/depcruise-config/src/defaultConfig.ts`, `packages/webpack-config/src/common/getConfig.ts` implement non-trivial logic without tests.
  - Impact: Downstream consumers can break silently after changes.
  - Fix approach:
    - Add snapshot and unit tests for the config generator functions in these packages.
    - Example targets: `packages/eslint-config/src/eslint.config.ts`, `packages/depcruise-config/src/defaultConfig.ts`, `packages/webpack-config/src/common/getConfig.ts`, `packages/webpack-config/src/common/getExternals.ts`.

9) Fragmented templating and many small builder modules (Medium)
- Symptom: `packages/webpack-config/src/` contains many small builder/templating files that together produce webpack configs; small changes can cascade.
  - Evidence: Files include `packages/webpack-config/src/templates/buildTemplate.ts`, `packages/webpack-config/src/bundles/buildBundle.ts`, `packages/webpack-config/src/plugins/*`, `packages/webpack-config/src/common/getEntry.ts`, `packages/webpack-config/src/common/getExternals.ts`, `packages/webpack-config/src/webpack-tsparticles.ts`.
  - Impact: Refactors are error-prone; discovery logic may break silently.
  - Fix approach:
    - Add unit tests per builder and snapshot tests for templates.
    - Centralize discovery/registry patterns for builders or provide an explicit plugin registration API.

10) Publish pipeline lacks verification tests (Low)
- Symptom: Publishing uses Nx Release and `prepack` scripts but there is no automated `pack`/smoke verification in CI.
  - Evidence: Root `package.json` (`./package.json`) contains Nx Release scripts (`version:*`, `publish:*`); packages include `prepack` entries (e.g., `packages/depcruise-config/package.json`, `packages/webpack-config/package.json`). `.github/workflows/npm-publish.yml` orchestrates publishing.
  - Impact: Published packages may omit expected files (`dist`, `types`) or expose incorrect `exports`/`files` fields.
  - Fix approach:
    - Add CI job that runs `pnpm pack` for each package and inspects the tarball contents for expected files.
    - Optionally run `npm install <tarball>` in a temporary project and import the package to validate runtime behaviour.

11) Secrets usage and token scopes (Info)
- Symptom: CI references `NX_CLOUD_ACCESS_TOKEN` and uses OIDC for publishing; tokens are configured as secrets in Actions (not in repo files).
  - Evidence: `.github/workflows/node.js-ci.yml` and `.github/workflows/npm-publish.yml` reference `secrets.NX_CLOUD_ACCESS_TOKEN` and `actions/setup-node` OIDC usage.
  - Impact: Operational; ensure least privilege and rotation policies for secrets.
  - Fix approach: Review secret scopes in GitHub, enforce periodic rotation, and restrict token permissions.

12) `TODO` matches appear mostly in generated / dependency files (Informational)
  - Symptom: Repository-wide fuzzy search finds `TODO`/`FIXME` instances mostly in `node_modules/` or other ignored/cache directories rather than in `packages/*/src`.
  - Evidence: scan results show TODOs located under `node_modules/` and paths that are ignored by Git (e.g., `.nx/cache`). These are likely upstream or generated files.
  - Impact: Low; maintainers should ignore upstream TODOs when triaging repository debt and focus on `packages/*/src` for actionable items.

Prioritised immediate tasks (recommended):
- High (1-2 sprints):
  - Add test runner and initial unit tests for `packages/depcruise-config` and `packages/webpack-config` and enable test execution in CI (`.github/workflows/node.js-ci.yml`).
  - Add dependency auditing and enable Dependabot (`.github/dependabot.yml`).
- Medium (1-3 sprints):
  - Remove or justify committed `dist/` artifacts and ensure `.nx/cache/` is ignored in `.gitignore`.
  - Gate heavy build plugins (e.g., `BundleAnalyzerPlugin` in `packages/webpack-config/src/common/getConfig.ts`) behind flags and avoid dual-output by default.
  - Add unit/snapshot tests for the config generator packages.
- Low:
  - Add publish verification (`pnpm pack` checks) and document dynamic `import()` semantics/mitigations in `packages/depcruise-config/README.md`.

If useful, I can implement or propose:
- A test scaffolding PR (choose `vitest`) and example tests for `packages/depcruise-config` and `packages/webpack-config`.
- A CI patch to add test and audit steps to `.github/workflows/node.js-ci.yml` and a `.github/dependabot.yml` draft.

---

Generated by codebase scan on 2026-03-08
