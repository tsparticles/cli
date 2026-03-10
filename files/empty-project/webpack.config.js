import { loadParticlesTemplate } from "@tsparticles/webpack-plugin";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url),
  __dirname = path.dirname(__filename),
  rootPkgPath = path.join(__dirname, "package.json"),
  pkg = JSON.parse(await readFile(rootPkgPath, "utf-8"));

export default loadParticlesTemplate({
  moduleName: "empty",
  templateName: "Empty",
  version: pkg.version,
  dir: __dirname,
});
