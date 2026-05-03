[![banner](https://particles.js.org/images/banner2.png)](https://particles.js.org)

# tsParticles CLI

## Installation

### NPM

```bash
npm install -g @particlesjs/cli
```

### Yarn

```bash
yarn global add @particlesjs/cli
```

### PNPM

```bash
pnpm global add @particlesjs/cli
```

## Usage

### Help

```bash
npx @particlesjs/cli --help
```

or

```bash
tsparticles-cli --help
```

### Build

```bash
npx @particlesjs/cli build
```

or

```bash
tsparticles-cli build
```

### Nx-aware build

The `build` command keeps the original human-friendly multi-flag workflow, but it can now delegate to Nx targets when it detects an Nx workspace.

```bash
tsparticles-cli build --nx
tsparticles-cli build --nx --clean --lint --tsc
tsparticles-cli build --bundle-webpack
tsparticles-cli build --bundle-rollup
```

- `--nx`: preferisce Nx quando il package e' in un workspace Nx e i target richiesti sono disponibili
- comportamento di default: prova Nx (target aggregato o granulari), poi fallback automatico agli script `package.json`

### Canonical Nx target convention

The CLI now looks for these canonical build-step targets first and falls back to historical script-style names when the plugin aliases are not present.

| Build step            | Canonical target | Historical fallback targets        |
| --------------------- | ---------------- | ---------------------------------- |
| full build            | `build`          | `build`                            |
| full CI build         | `build:ci`       | `build:ci`, `build-ci`             |
| clean                 | `clean`          | `clear:dist`                       |
| source prettify       | `prettify`       | `prettify:src`, `format`           |
| CI prettify           | `prettify:ci`    | `prettify:ci:src`                  |
| lint                  | `lint`           | `lint`                             |
| lint CI               | `lint:ci`        | `lint:ci`                          |
| TypeScript build      | `tsc`            | `compile`, `build:ts`, `typecheck` |
| circular dependencies | `circular-deps`  | `circular-deps`                    |
| webpack bundle        | `bundle:webpack` | `build:bundle:webpack`             |
| rollup bundle         | `bundle:rollup`  | `build:bundle:rollup`              |
| dist files            | `distfiles`      | `distfiles`, `build:distfiles`     |

The workspace-local Nx plugin `@tsparticles/cli-nx-plugin` infers the canonical aliases automatically for packages in this repository, so packages can keep their current npm scripts while exposing friendlier Nx targets.

### Verify in this workspace

From the `cli` root, these commands validate the Nx integration end-to-end:

```bash
pnpm nx show project @tsparticles/cli-command-build --json
pnpm nx run @tsparticles/cli-command-build:tsc
pnpm nx run @tsparticles/cli-command-build:test
pnpm run build
```

### Create

#### Preset

```bash
npx @particlesjs/cli create preset <folder>
```

or

```bash
tsparticles-cli create preset <folder>
```
