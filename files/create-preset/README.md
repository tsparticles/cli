[![banner](https://particles.js.org/images/banner2.png)](https://particles.js.org)

# tsParticles Template Preset

[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/tsparticles-preset-template/badge)](https://www.jsdelivr.com/package/npm/tsparticles-preset-template) [![npmjs](https://badge.fury.io/js/tsparticles-preset-template.svg)](https://www.npmjs.com/package/tsparticles-preset-template) [![npmjs](https://img.shields.io/npm/dt/tsparticles-preset-template)](https://www.npmjs.com/package/tsparticles-preset-template)

[tsParticles](https://github.com/matteobruni/tsparticles) preset template.

## Sample

![demo](https://raw.githubusercontent.com/tsparticles/preset-template/main/images/sample.png)

## How to use it

### CDN / Vanilla JS / jQuery

The first step is installing [tsParticles](https://github.com/matteobruni/tsparticles) following the instructions for
vanilla javascript in the main project [here](https://github.com/matteobruni/tsparticles)

Once installed you need one more script to be included in your page (or you can download that
from [jsDelivr](https://www.jsdelivr.com/package/npm/tsparticles-preset-template):

```html
<script src="https://cdn.jsdelivr.net/npm/@tsparticles/engine@2/tsparticles.engine.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tsparticles-preset-template/tsparticles.preset.template.min.js"></script>
```

This script **MUST** be placed after the `tsParticles` one.

#### Bundle

A bundled script can also be used, this will include every needed plugin needed by the preset.

```html
<script src="https://cdn.jsdelivr.net/npm/tsparticles-preset-template/tsparticles.preset.template.bundle.min.js"></script>
```

### Usage

Once the scripts are loaded you can set up `tsParticles` like this:

```javascript
(async () => {
    await tsParticles.load("tsparticles", {
        preset: "template",
    });
})();
```

#### Customization

**Important**
You can override all the options defining the properties like in any standard `tsParticles` installation.

```javascript
(async () => {
    await tsParticles.load("tsparticles", {
        particles: {
            shape: {
                type: "square"
            }
        },
        preset: "template"
    });
})();
```

Like in the sample above, the circles will be replaced by squares.

### React.js / Preact / Inferno

_The syntax for `React.js`, `Preact` and `Inferno` is the same_.

This sample uses the class component syntax, but you can use hooks as well (if the library supports it).

```javascript
import Particles from "react-particles";
import { Engine } from "@tsparticles/engine";
import { loadTemplatePreset } from "tsparticles-preset-template";

export class ParticlesContainer extends React.PureComponent<IProps> {
  // this customizes the component tsParticles installation
  async customInit(engine: Engine) {
    // this adds the preset to tsParticles, you can safely use the
    await loadTemplatePreset(engine);
  }

  render() {
    const options = {
      preset: "template",
    };

    return <Particles options={options} init={this.customInit} />;
  }
}
```

### Vue (2.x and 3.x)

_The syntax for `Vue.js 2.x` and `3.x` is the same_

```vue
<Particles id="tsparticles" :particlesInit="particlesInit" url="http://foo.bar/particles.json" />
```

```js
async function particlesInit(engine: Engine) {
    await loadTemplatePreset(main);
}
```

### Angular

```html

<ng-particles
    [id]="id"
    [options]="particlesOptions"
    [particlesInit]="particlesInit"
></ng-particles>
```

```ts
async function particlesInit(engine: Engine): Promise<void> {
    loadTemplatePreset(engine);
}
```

### Svelte

```sveltehtml

<Particles
        id="tsparticles"
        url="{particlesUrl}"
        particlesInit="{particlesInit}"
/>
```

```js
let particlesInit = async (engine) => {
    await loadTemplatePreset(engine);
};
```
