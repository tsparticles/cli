import { Command } from "commander";
import { circularDeps } from "./utils.js";
import { existsSync } from "node:fs";

const circularDepsCommand = new Command("circular-deps");

circularDepsCommand.description("Checks the circular dependencies in the tsParticles library");
circularDepsCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
circularDepsCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

circularDepsCommand.action(async () => {
  const opts = circularDepsCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  if (!(await circularDeps(basePath, silent))) {
    throw new Error("Bundle failed");
  }

  console.info("Circular deps check finished successfully!");
});

export { circularDeps, circularDepsCommand };
