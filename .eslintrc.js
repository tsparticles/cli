const path = require("path");

module.exports = {
    extends: ["@tsparticles/eslint-config"],
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: path.join(__dirname, "src"),
        sourceType: "module"
    },
    rules: {
        "no-console": "off"
    }
};
