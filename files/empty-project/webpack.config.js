const { loadParticlesTemplate } = require("@tsparticles/webpack-plugin"),
    version = require("./package.json").version;

module.exports = loadParticlesTemplate({ moduleName: "empty", templateName: "Empty", version, dir: __dirname });
