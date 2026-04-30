import { Command } from "commander";
import { bundle } from "./utils.js";
import { existsSync } from "node:fs";

const bundleCommand = new Command("bundle");

bundleCommand.description("Bundle the tsParticles library");
bundleCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
bundleCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

bundleCommand.action(async () => {
  const opts = bundleCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  if (!(await bundle(basePath, silent))) {
    throw new Error("Bundle failed");
  }

  console.log("Bundle finished successfully!");
});

export { bundle, bundleCommand };
