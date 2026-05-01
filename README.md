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

The CLI can now cooperate with Nx instead of always running its internal build pipeline.

```bash
tsparticles-cli build --nx
tsparticles-cli build --nx --clean --lint --tsc
pnpm nx run @tsparticles/cli-command-build:tsc
```

Inside this repository, the local plugin `@tsparticles/cli-nx-plugin` augments package-based projects with canonical tsParticles targets like `clean`, `prettify`, `prettify:ci`, and `tsc`, while preserving the existing npm script names.

### Create

#### Preset

```bash
npx @particlesjs/cli create preset <folder>
```

or

```bash
tsparticles-cli create preset <folder>
```
