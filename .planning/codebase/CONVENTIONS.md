# Coding Conventions

## Style & Formatting

- TypeScript with strict-ish settings via `tsconfig.json`.
- Prettier + ESLint enforced in repository (`prettier` and `eslint.config.js`).

## Naming & Organization

- Organize by feature: `src/create/*`, `src/build/*`.
- Utilities go into `src/utils` with descriptive names: `file-utils.ts`, `string-utils.ts`.

## Error handling

- CLI and build scripts favor throwing errors that bubble to top-level handlers in `src/cli.ts`.

## Commits & PRs

- Repository uses conventional commits in scripts (see `scripts/postversion.js` for versioning hooks).

## Notes for contributors

- Follow existing file naming and module boundaries.
- Add tests for new utilities and CLI behaviors using Vitest.
