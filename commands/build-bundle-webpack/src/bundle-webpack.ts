import { Command } from "commander";
import { bundleWebpack } from "./utils.js";
import { existsSync } from "node:fs";

const bundleWebpackCommand = new Command("bundle:webpack");

bundleWebpackCommand.description("Bundle the tsParticles library using Webpack");
bundleWebpackCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
bundleWebpackCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

bundleWebpackCommand.action(async () => {
  const opts = bundleWebpackCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  if (!(await bundleWebpack(basePath, silent))) {
    throw new Error("Webpack bundling failed");
  }

  console.info("Webpack bundling completed successfully!");
});

export { bundleWebpack, bundleWebpackCommand };
