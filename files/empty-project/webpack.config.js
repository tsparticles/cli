const { loadParticlesTemplate } = require("@tsparticles/webpack-plugin"),
    version = require("./package.json").version;

module.exports = loadParticlesTemplate("empty", "Empty", version, __dirname);
