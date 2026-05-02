import { prettifyPackageDistJson, prettifyPackageJson, prettifyReadme, prettifySrc } from "./utils.js";
import { Command } from "commander";
import { existsSync } from "node:fs";
import path from "node:path";

const prettierCommand = new Command("prettier");

prettierCommand.description("Prepare the dist files for tsParticles library");
prettierCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
prettierCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

prettierCommand.action(async (argPath: string) => {
  const opts = prettierCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd();

  if (!existsSync(basePath)) {
    throw new Error("Provided path does not exist");
  }

  const srcPath = path.join(basePath, argPath);

  if (!existsSync(srcPath)) {
    throw new Error("Provided path does not exist");
  }

  let canContinue = await prettifySrc(basePath, srcPath, ci, silent);

  if (canContinue) {
    canContinue =
      (await prettifyReadme(basePath, ci, silent)) &&
      (await prettifyPackageJson(basePath, ci, silent)) &&
      (await prettifyPackageDistJson(basePath, ci, silent));
  }

  if (!canContinue) {
    throw new Error("Dist files build failed");
  }

  console.info("Bundle finished successfully!");
});

export { prettifySrc, prettifyReadme, prettifyPackageJson, prettifyPackageDistJson, prettierCommand };
