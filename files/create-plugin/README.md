[![banner](https://particles.js.org/images/banner2.png)](https://particles.js.org)

# tsParticles Template Plugin

[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/tsparticles-plugin-template/badge)](https://www.jsdelivr.com/package/npm/tsparticles-plugin-template)
[![npmjs](https://badge.fury.io/js/tsparticles-plugin-template.svg)](https://www.npmjs.com/package/tsparticles-plugin-template)
[![npmjs](https://img.shields.io/npm/dt/tsparticles-plugin-template)](https://www.npmjs.com/package/tsparticles-plugin-template) [![GitHub Sponsors](https://img.shields.io/github/sponsors/matteobruni)](https://github.com/sponsors/matteobruni)

[tsParticles](https://github.com/matteobruni/tsparticles) plugin for particles template.

## How to use it

### CDN / Vanilla JS / jQuery

The CDN/Vanilla version JS has one required file in vanilla configuration:

Including the `tsparticles.plugin.template.min.js` file will export the function to load the plugin:

```javascript
loadTemplatePlugin;
```

### Usage

Once the scripts are loaded you can set up `tsParticles` and the plugin like this:

```javascript
(async () => {
  await loadTemplatePlugin(tsParticles);

  await tsParticles.load({
    id: "tsparticles",
    options: {
      /* options */
    },
  });
})();
```

### ESM / CommonJS

This package is compatible also with ES or CommonJS modules, firstly this needs to be installed, like this:

```shell
$ npm install tsparticles-plugin-template
```

or

```shell
$ yarn add tsparticles-plugin-template
```

Then you need to import it in the app, like this:

```javascript
const { tsParticles } = require("tsparticles-engine");
const { loadTemplatePlugin } = require("tsparticles-plugin-template");

(async () => {
  await loadTemplatePlugin(tsParticles);
})();
```

or

```javascript
import { tsParticles } from "tsparticles-engine";
import { loadTemplatePlugin } from "tsparticles-plugin-template";

(async () => {
  await loadTemplatePlugin(tsParticles);
})();
```
