import {loadParticlesTemplate} from "@tsparticles/webpack-plugin";
import { version } from "./package.json" assert { type: "json" };

export default loadParticlesTemplate({moduleName: "empty", templateName: "Empty", version, dir: __dirname});
