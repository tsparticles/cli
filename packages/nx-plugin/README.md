[![banner](https://particles.js.org/images/banner2.png)](https://particles.js.org)

# tsParticles Nx Plugin

Internal Nx plugin used by the `tsParticles CLI` workspace.

## What it does

The plugin augments package-based Nx projects under `commands/*` and `packages/*` with canonical tsParticles build-step aliases.

### Canonical aliases inferred by the plugin

| Canonical target | Script fallback                       |
| ---------------- | ------------------------------------- |
| `clean`          | `clear:dist`                          |
| `prettify`       | `prettify:src` or `format`            |
| `prettify:ci`    | `prettify:ci:src`                     |
| `tsc`            | `compile`, `build:ts`, or `typecheck` |
| `bundle`         | `build:bundle`                        |
| `distfiles`      | `build:distfiles`                     |

This allows Nx-friendly commands such as:

```bash
pnpm nx run @tsparticles/cli-command-build:tsc
pnpm nx run @tsparticles/cli-command-build:clean
```

without forcing every package to rename its existing npm scripts.
