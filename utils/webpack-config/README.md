# @tsparticles/webpack-plugin

Utility package that generates webpack configurations for tsParticles engine, bundles, plugins, presets, shapes, paths, interactions, effects, templates, palettes, and updaters.

## Installation

```bash
pnpm add -D @tsparticles/webpack-plugin webpack webpack-cli
```

## Exports

```ts
import {
  loadParticlesBundle,
  loadParticlesEffect,
  loadParticlesEngine,
  loadParticlesInteraction,
  loadParticlesInteractionExternal,
  loadParticlesInteractionParticles,
  loadParticlesPalette,
  loadParticlesPath,
  loadParticlesPlugin,
  loadParticlesPluginEasing,
  loadParticlesPluginEmittersShape,
  loadParticlesPluginExport,
  loadParticlesPreset,
  loadParticlesShape,
  loadParticlesTemplate,
  loadParticlesUpdater,
} from "@tsparticles/webpack-plugin";
```

## Basic Example

```ts
import { loadParticlesPlugin } from "@tsparticles/webpack-plugin";

export default loadParticlesPlugin({
  bundle: true,
  dir: process.cwd(),
  moduleName: "your-plugin",
  pluginName: "Your Plugin",
  progress: false,
  version: "1.0.0",
});
```

The helpers return webpack config objects (or arrays of configs) ready to be exported from your `webpack.config` file.

## Notes

- Output files are generated in each consumer package `dist` directory.
- Helpers support optional external mappings through `additionalExternals` where applicable.
- Bundle/non-bundle variants are generated depending on the helper and input options.

## Build (package maintainers)

```bash
pnpm run build
```

## License

MIT
