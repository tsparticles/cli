/* eslint-disable sort-imports */
import { Command } from "commander";
import { bundleWebpackCommand } from "@tsparticles/cli-command-build-bundle-webpack";
import { bundleRollupCommand } from "@tsparticles/cli-command-build-bundle-rollup";
import { circularDepsCommand } from "@tsparticles/cli-command-build-circular-deps";
import { clearCommand } from "@tsparticles/cli-command-build-clear";
import { distFilesCommand } from "@tsparticles/cli-command-build-distfiles";
import { getDistStats, type IDistStats } from "@tsparticles/cli-command-build-diststats";
import { esLintCommand } from "@tsparticles/cli-command-build-eslint";
import { prettierCommand } from "@tsparticles/cli-command-build-prettier";
import { tscCommand } from "@tsparticles/cli-command-build-tsc";

import type { BuildExecutionOptions } from "./build-options.js";
import { runLegacyBuild } from "./legacy-runner.js";
import { tryRunNxBuild } from "./nx-runner.js";

const minSize = 0;

/**
 * Prints the difference in dist stats between two builds.
 * @param oldStats - stats captured before the build
 * @param newStats - stats captured after the build
 */
function printDistStatsDiff(oldStats: IDistStats, newStats: IDistStats): void {
  const diffSize = newStats.totalSize - oldStats.totalSize,
    bundleDiffSize = newStats.bundleSize - oldStats.bundleSize,
    bundleSizeIncreased = bundleDiffSize > minSize,
    bundleSizeText = bundleSizeIncreased ? "increased" : "decreased",
    diffSizeText = diffSize > minSize ? "increased" : "decreased",
    outputFunc = bundleSizeIncreased ? console.warn : console.info,
    texts = [
      bundleDiffSize
        ? `Bundle size ${bundleSizeText} from ${oldStats.bundleSize.toString()} to ${newStats.bundleSize.toString()} (${Math.abs(bundleDiffSize).toString()}B)`
        : "Bundle size unchanged",
      diffSize
        ? `Size ${diffSizeText} from ${oldStats.totalSize.toString()} to ${newStats.totalSize.toString()} (${Math.abs(diffSize).toString()}B)`
        : "Size unchanged",
      `Files count changed from ${oldStats.totalFiles.toString()} to ${newStats.totalFiles.toString()} (${(newStats.totalFiles - oldStats.totalFiles).toString()})`,
      `Folders count changed from ${oldStats.totalFolders.toString()} to ${newStats.totalFolders.toString()} (${(newStats.totalFolders - oldStats.totalFolders).toString()})`,
    ];

  for (const text of texts) {
    outputFunc(text);
  }
}

const buildCommand = new Command("build");

buildCommand.description("Build the tsParticles library using TypeScript");

buildCommand.addCommand(bundleWebpackCommand);
buildCommand.addCommand(bundleRollupCommand);
buildCommand.addCommand(circularDepsCommand);
buildCommand.addCommand(clearCommand);
buildCommand.addCommand(distFilesCommand);
buildCommand.addCommand(esLintCommand);
buildCommand.addCommand(prettierCommand);
buildCommand.addCommand(tscCommand);

buildCommand.option(
  "-a, --all",
  "Do all build steps (default if no flags are specified) (same as -b -c -d -l -p -t)",
  false,
);
buildCommand.option("-b, --bundle-webpack", "Bundle the library using Webpack", false);
buildCommand.option("--bundle-rollup", "Bundle the library using Rollup", false);
buildCommand.option("-c, --clean", "Clean the dist folder", false);
buildCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
buildCommand.option("-r, --circular-deps", "Check for circular dependencies", false);
buildCommand.option("-d, --dist", "Build the dist files", false);
buildCommand.option("-l, --lint", "Lint the source files", false);
buildCommand.option("-p, --prettify", "Prettify the source files", false);
buildCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);
buildCommand.option("-t, --tsc", "Build the library using TypeScript", false);
buildCommand.option("--nx", "Prefer running Nx targets when available", false);

buildCommand.argument("[path]", `Path to the project root folder, default is "src"`, "src");

buildCommand.action(async (argPath: string) => {
  const opts = buildCommand.opts(),
    all =
      !!opts["all"] ||
      (!opts["bundleWebpack"] &&
        !opts["bundleRollup"] &&
        !opts["clean"] &&
        !opts["circularDeps"] &&
        !opts["dist"] &&
        !opts["lint"] &&
        !opts["prettify"] &&
        !opts["tsc"]),
    silentOpt = opts["silent"] as string | boolean,
    commandOptions: BuildExecutionOptions = {
      all,
      argPath,
      basePath: process.cwd(),
      ci: !!opts["ci"],
      circularDeps: all || !!opts["circularDeps"],
      clean: all || !!opts["clean"],
      distfiles: all || !!opts["dist"],
      doBundleRollup: !!opts["bundleRollup"],
      doBundleWebpack: all || !!opts["bundleWebpack"],
      doLint: all || !!opts["lint"],
      prettier: all || !!opts["prettify"],
      silent: silentOpt === "false" ? false : !!silentOpt || !!opts["ci"],
      tsc: all || !!opts["tsc"],
      useNx: !!opts["nx"],
    },
    oldStats = await getDistStats(commandOptions.basePath);

  if (tryRunNxBuild(commandOptions)) {
    if (!commandOptions.silent) {
      printDistStatsDiff(oldStats, await getDistStats(commandOptions.basePath));
    }

    return;
  }

  runLegacyBuild(commandOptions);

  if (!commandOptions.silent) {
    printDistStatsDiff(oldStats, await getDistStats(commandOptions.basePath));
  }
});

export { buildCommand };
