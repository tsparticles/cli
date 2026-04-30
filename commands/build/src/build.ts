import { Command } from "commander";
import { bundleCommand } from "@tsparticles/cli-command-build-bundle";
import { circularDepsCommand } from "@tsparticles/cli-command-build-circular-deps";
import { existsSync } from "node:fs";
import path from "node:path";

const buildCommand = new Command("build");

buildCommand.description("Build the tsParticles library using TypeScript");
buildCommand.addCommand(bundleCommand);
buildCommand.addCommand(circularDepsCommand);
buildCommand.option(
  "-a, --all",
  "Do all build steps (default if no flags are specified) (same as -b -c -d -l -p -t)",
  false,
);
buildCommand.option("-b, --bundle", "Bundle the library using Webpack", false);
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

buildCommand.argument("[path]", `Path to the project root folder, default is "src"`, "src");

buildCommand.action(async (argPath: string) => {
  const opts = buildCommand.opts(),
    ci = !!opts["ci"],
    all =
      !!opts["all"] ||
      (!opts["bundle"] &&
        !opts["clean"] &&
        !opts["circularDeps"] &&
        !opts["dist"] &&
        !opts["lint"] &&
        !opts["prettify"] &&
        !opts["tsc"]),
    doBundle = all || !!opts["bundle"],
    circularDeps = all || !!opts["circularDeps"],
    clean = all || !!opts["clean"],
    distfiles = all || !!opts["dist"],
    doLint = all || !!opts["lint"],
    prettier = all || !!opts["prettify"],
    tsc = all || !!opts["tsc"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci,
    basePath = process.cwd(),
    { getDistStats } = await import("./build-diststats.js"),
    oldStats = await getDistStats(basePath);

  if (clean) {
    const { clearDist } = await import("./build-clear.js");

    await clearDist(basePath, silent);
  }

  const srcPath = path.join(basePath, argPath);

  if (!existsSync(srcPath)) {
    throw new Error("Provided path does not exist");
  }

  let canContinue = true;

  if (prettier) {
    const { prettifySrc } = await import("./build-prettier.js");

    canContinue = await prettifySrc(basePath, srcPath, ci, silent);
  }

  if (canContinue && doLint) {
    const { lint } = await import("./build-eslint.js");

    canContinue = await lint(ci, silent);
  }

  if (canContinue && (tsc || circularDeps)) {
    const checks: Promise<boolean>[] = [];

    if (tsc) {
      checks.push(import("./build-tsc.js").then(({ buildTS }) => buildTS(basePath, silent)));
    }

    if (circularDeps) {
      checks.push(
        import("@tsparticles/cli-command-build-circular-deps").then(({ circularDeps }) =>
          circularDeps(basePath, silent),
        ),
      );
    }

    canContinue = (await Promise.all(checks)).every(result => result);
  }

  if (canContinue && doBundle) {
    const { bundle } = await import("@tsparticles/cli-command-build-bundle");

    canContinue = await bundle(basePath, silent);
  }

  if (canContinue && prettier) {
    const { prettifyReadme, prettifyPackageJson, prettifyPackageDistJson } = await import("./build-prettier.js");

    canContinue =
      (await prettifyReadme(basePath, ci, silent)) &&
      (await prettifyPackageJson(basePath, ci, silent)) &&
      (await prettifyPackageDistJson(basePath, ci, silent));
  }

  if (canContinue && distfiles) {
    const { buildDistFiles } = await import("./build-distfiles.js");

    canContinue = await buildDistFiles(basePath, silent);
  }

  if (!canContinue) {
    throw new Error("Build failed");
  }

  let texts: string[] = [],
    outputFunc = console.info;

  if (!silent) {
    const newStats = await getDistStats(basePath),
      diffSize = newStats.totalSize - oldStats.totalSize,
      bundleDiffSize = newStats.bundleSize - oldStats.bundleSize,
      minSize = 0,
      bundleSizeIncreased = bundleDiffSize > minSize,
      bundleSizeIncreasedText = bundleSizeIncreased ? "increased" : "decreased",
      diffSizeIncreasedText = diffSize > minSize ? "increased" : "decreased";

    outputFunc = bundleSizeIncreased ? console.warn : console.info;

    texts = [
      bundleDiffSize
        ? `Bundle size ${bundleSizeIncreasedText} from ${oldStats.bundleSize.toString()} to ${newStats.bundleSize.toString()} (${Math.abs(bundleDiffSize).toString()}B)`
        : "Bundle size unchanged",
      diffSize
        ? `Size ${diffSizeIncreasedText} from ${oldStats.totalSize.toString()} to ${newStats.totalSize.toString()} (${Math.abs(diffSize).toString()}B)`
        : "Size unchanged",
      `Files count changed from ${oldStats.totalFiles.toString()} to ${newStats.totalFiles.toString()} (${(
        newStats.totalFiles - oldStats.totalFiles
      ).toString()})`,
      `Folders count changed from ${oldStats.totalFolders.toString()} to ${newStats.totalFolders.toString()} (${(
        newStats.totalFolders - oldStats.totalFolders
      ).toString()})`,
    ];
  }

  console.log("Build finished successfully!");

  if (!silent) {
    for (const text of texts) {
      outputFunc(text);
    }
  }
});

export { buildCommand };
