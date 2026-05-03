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

### Build in an Nx workspace

The `build` command can delegate to Nx targets when it detects an Nx workspace.

```bash
tsparticles-cli build --nx
tsparticles-cli build --nx --clean --lint --tsc
tsparticles-cli build --legacy
pnpm nx run @tsparticles/cli-command-build:tsc
```

- `--nx`: forces Nx-target execution when required targets exist
- `--legacy`: disables Nx-aware mode and runs the original in-process pipeline
- default behavior in this workspace: with no granular flags, `build`/`build:ci` Nx aggregate targets are preferred when available

Inside this repository, the local plugin `@tsparticles/cli-nx-plugin` augments package projects under `commands/*`, `packages/*`, and `utils/*` with canonical aliases like `clean`, `prettify`, `prettify:ci`, `tsc`, `bundle`, and `distfiles`.

## Workspace commands (development)

From the `cli` root:

```bash
pnpm run show:projects
pnpm run build
pnpm run build:affected
pnpm run build:ci
pnpm run lint
pnpm run lint:ci
pnpm run test
pnpm run test:ci
```

### Focused Nx commands

```bash
pnpm nx show project @tsparticles/cli-command-build --json
pnpm nx run @tsparticles/cli-command-build:build
pnpm nx run @tsparticles/cli-nx-plugin:build
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
