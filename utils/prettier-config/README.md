# @tsparticles/prettier-config

Shared Prettier configuration for tsParticles projects.

## Installation

```bash
pnpm add -D @tsparticles/prettier-config prettier
```

## Usage

In your `package.json`:

```json
{
  "prettier": "@tsparticles/prettier-config"
}
```

Or in `.prettierrc`:

```json
"@tsparticles/prettier-config"
```

## Defaults

Key defaults from the shared config:

- `semi: true`
- `singleQuote: false`
- `printWidth: 120`
- `endOfLine: lf`
- includes `prettier-plugin-multiline-arrays`

## Build (package maintainers)

```bash
pnpm run build
```

## License

MIT
