import {loadParticlesTemplate} from "@tsparticles/webpack-plugin";
import {fileURLToPath} from "url";
import fs from "fs-extra";
import path from "path";

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename),
    rootPkgPath = path.join(__dirname, "package.json"),
    pkg = await fs.readJson(rootPkgPath);

export default loadParticlesTemplate({
    moduleName: "empty",
    templateName: "Empty",
    version: pkg.version,
    dir: __dirname
});
