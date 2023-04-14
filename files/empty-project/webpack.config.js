const { loadParticlesTemplate } = require("webpack-tsparticles-plugin"),
    version = require("./package.json").version;

module.exports = loadParticlesTemplate("empty", "Empty", version, __dirname);
