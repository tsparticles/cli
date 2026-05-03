import { Command } from "commander";
import { buildTS } from "./utils.js";
import { existsSync } from "node:fs";

const tscCommand = new Command("tsc");

tscCommand.description("Build the TypeScript files for tsParticles library");
tscCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
tscCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

tscCommand.action(async () => {
  const opts = tscCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  if (!(await buildTS(basePath, silent))) {
    throw new Error("TypeScript build failed");
  }

  console.info("TypeScript build finished successfully!");
});

export { buildTS, tscCommand };
