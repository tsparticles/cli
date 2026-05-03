# @tsparticles/depcruise-config

Shared Dependency Cruiser configuration for tsParticles packages.

It exports:

- `defaultConfig`: a reusable baseline ruleset
- `loadDependencyCruiserConfig(cwd?)`: async helper that loads local config files if present, otherwise falls back to `defaultConfig`

## Installation

```bash
pnpm add -D @tsparticles/depcruise-config dependency-cruiser
```

## Usage

```ts
import {
  defaultConfig,
  loadDependencyCruiserConfig,
} from "@tsparticles/depcruise-config";

const config = await loadDependencyCruiserConfig();
// fallback behavior:
// - loads .dependency-cruiser.cjs / .js / .mjs from cwd
// - returns defaultConfig when none are found
```

To use the shared defaults directly in your local file:

```js
// .dependency-cruiser.mjs
import { defaultConfig } from "@tsparticles/depcruise-config";

export default defaultConfig;
```

## Build (package maintainers)

```bash
pnpm run build
```

## License

MIT
