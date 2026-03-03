# ROADMAP

## Overview

Phases derived from v1 requirements. All v1 requirements are covered across the phases below.

| #   | Phase                | Goal                                          | Requirements                   |
| --- | -------------------- | --------------------------------------------- | ------------------------------ |
| 1   | Core CLI & Templates | Ensure CLI scaffolding and build are reliable | CLI-01, CLI-02, TPL-01, TPL-02 |
| 2   | Tests & CI           | Ensure tests run and CI is healthy            | CLI-03                         |
| 3   | Docs & Developer UX  | Improve contributor onboarding and docs       | DOC-01                         |

## Phase Details

### Phase 1: Core CLI & Templates

Goal: Users can scaffold plugins and shapes and build the codebase locally.
Requirements: CLI-01, CLI-02, TPL-01, TPL-02
Success criteria:

1. `create plugin` generates a working plugin scaffold
2. TypeScript build completes without errors
3. Templates include README and basic tests

### Phase 2: Tests & CI

Goal: Ensure tests run locally and in CI, coverage tracked.
Requirements: CLI-03
Success criteria:

1. Vitest runs and reports passing tests locally
2. CI workflow runs tests and reports status

### Phase 3: Docs & Developer UX

Goal: Improve onboarding and developer docs
Requirements: DOC-01
Success criteria:

1. CONTRIBUTING.md created with setup steps
2. Quickstart added to README
