import { Command } from "commander";
import { buildDistFiles } from "./utils.js";
import { existsSync } from "node:fs";

const distfilesCommand = new Command("distfiles");

distfilesCommand.description("Prepare the dist files for tsParticles library");
distfilesCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
distfilesCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

distfilesCommand.action(async () => {
  const opts = distfilesCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  if (!(await buildDistFiles(basePath, silent))) {
    throw new Error("Dist files build failed");
  }

  console.log("Bundle finished successfully!");
});

export { buildDistFiles, distfilesCommand };
