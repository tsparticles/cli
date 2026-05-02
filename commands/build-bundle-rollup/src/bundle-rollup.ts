import { Command } from "commander";
import { bundleRollup } from "./utils.js";
import { existsSync } from "node:fs";

const bundleRollupCommand = new Command("bundle:rollup");

bundleRollupCommand.description("Bundle the tsParticles library using Rollup");
bundleRollupCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
bundleRollupCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

bundleRollupCommand.action(async () => {
  const opts = bundleRollupCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  if (!(await bundleRollup(basePath, silent))) {
    throw new Error("Rollup bundling failed");
  }

  console.info("Rollup bundling completed successfully!");
});

export { bundleRollup, bundleRollupCommand };
