# tsParticles Utils Monorepo

Shared build and tooling utilities used across the [tsParticles ecosystem](https://github.com/matteobruni/tsparticles).

## Packages

- [`@tsparticles/browserslist-config`](./browserslist-config/README.md): shared Browserslist targets
- [`@tsparticles/depcruise-config`](./depcruise-config/README.md): shared Dependency Cruiser rules and loader
- [`@tsparticles/eslint-config`](./eslint-config/README.md): shared ESLint 10 flat config
- [`@tsparticles/prettier-config`](./prettier-config/README.md): shared Prettier config
- [`@tsparticles/tsconfig`](./tsconfig/README.md): shared TypeScript config presets
- [`@tsparticles/webpack-plugin`](./webpack-config/README.md): helper functions to generate tsParticles webpack configs

## Requirements

- `node` (current active LTS recommended)
- `pnpm` `10.x`

## Workspace Setup

```bash
pnpm install
```

## Useful Commands

Run from repository root.

```bash
# build all packages
pnpm nx run-many -t build

# build all packages in CI mode
pnpm nx run-many -t build:ci

# build only affected projects
pnpm nx affected -t build
```

## Release Flow

Versioning and publishing are managed with Nx Release using conventional commits.

```bash
# pre-release version bump
pnpm run version:alpha
pnpm run version:beta

# publish packages already versioned in package.json
pnpm run publish:alpha
pnpm run publish:beta
```

## License

MIT
