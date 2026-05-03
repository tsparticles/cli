# @tsparticles/eslint-config

Shared ESLint 10 flat configuration for tsParticles TypeScript projects.

## Installation

```bash
pnpm add -D @tsparticles/eslint-config eslint typescript
```

## Usage

Create an `eslint.config.mjs` (or `.js`) file in your project:

```js
import config from "@tsparticles/eslint-config";

export default config;
```

Then run ESLint as usual:

```bash
pnpm exec eslint .
```

## Notes

- The config is optimized for TypeScript projects and uses type-aware linting when a local `tsconfig.json` is found.
- It includes recommended sets for JavaScript, TypeScript, JSDoc, TSDoc, stylistic rules, and Prettier integration.

## Build (package maintainers)

```bash
pnpm run build
```

## License

MIT
