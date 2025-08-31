import {loadParticlesTemplate} from "@tsparticles/webpack-plugin";
import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename),
    pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')),
    version = pkg.version;

export default loadParticlesTemplate({moduleName: "empty", templateName: "Empty", version, dir: __dirname});
