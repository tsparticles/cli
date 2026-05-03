# @tsparticles/tsconfig

Shared TypeScript configuration presets for tsParticles packages.

## Installation

```bash
pnpm add -D @tsparticles/tsconfig typescript
```

## Available Presets

- `@tsparticles/tsconfig/tsconfig.base.json`: strict baseline shared options
- `@tsparticles/tsconfig/tsconfig.json`: NodeNext-oriented preset
- `@tsparticles/tsconfig/tsconfig.module.json`: ES module + Bundler resolution preset
- `@tsparticles/tsconfig/tsconfig.browser.json`: browser-focused module preset
- `@tsparticles/tsconfig/tsconfig.types.json`: declarations-only preset

## Usage

```json
{
  "extends": "@tsparticles/tsconfig/tsconfig.json"
}
```

For type declarations only builds:

```json
{
  "extends": "@tsparticles/tsconfig/tsconfig.types.json"
}
```

## Build (package maintainers)

```bash
pnpm run build
```

## License

MIT
