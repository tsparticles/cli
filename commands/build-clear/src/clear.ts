import { Command } from "commander";
import { clearDist } from "./utils.js";
import { existsSync } from "node:fs";

const clearCommand = new Command("clear");

clearCommand.description("Clear the build of tsParticles library");
clearCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
clearCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

clearCommand.action(async () => {
  const opts = clearCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  if (!(await clearDist(basePath, silent))) {
    throw new Error("Bundle failed");
  }

  console.log("Cleared files successfully!");
});

export { clearDist, clearCommand };
