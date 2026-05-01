/* eslint-disable sort-imports */
/* eslint-disable jsdoc/require-jsdoc */
import * as fs from "node:fs";
import path from "node:path";

import type { BuildExecutionOptions } from "./build-options.js";

export async function runLegacyBuild(options: BuildExecutionOptions): Promise<void> {
  const { getDistStats } = await import("@tsparticles/cli-command-build-diststats"),
    oldStats = await getDistStats(options.basePath);

  if (options.clean) {
    const { clearDist } = await import("@tsparticles/cli-command-build-clear");

    await clearDist(options.basePath, options.silent);
  }

  const srcPath = path.join(options.basePath, options.argPath);

  if (!fs.existsSync(srcPath)) {
    throw new Error("Provided path does not exist");
  }

  let canContinue = true;

  if (options.prettier) {
    const { prettifySrc } = await import("@tsparticles/cli-command-build-prettier");

    canContinue = await prettifySrc(options.basePath, srcPath, options.ci, options.silent);
  }

  if (canContinue && options.doLint) {
    const { lint } = await import("@tsparticles/cli-command-build-eslint");

    canContinue = await lint(options.ci, options.silent);
  }

  if (canContinue && (options.tsc || options.circularDeps)) {
    const checks: Promise<boolean>[] = [];

    if (options.tsc) {
      checks.push(
        import("@tsparticles/cli-command-build-tsc").then(({ buildTS }) => buildTS(options.basePath, options.silent)),
      );
    }

    if (options.circularDeps) {
      checks.push(
        import("@tsparticles/cli-command-build-circular-deps").then(({ circularDeps }) =>
          circularDeps(options.basePath, options.silent),
        ),
      );
    }

    canContinue = (await Promise.all(checks)).every(Boolean);
  }

  if (canContinue && options.doBundle) {
    const { bundle } = await import("@tsparticles/cli-command-build-bundle");

    canContinue = await bundle(options.basePath, options.silent);
  }

  if (canContinue && options.prettier) {
    const { prettifyReadme, prettifyPackageJson, prettifyPackageDistJson } =
      await import("@tsparticles/cli-command-build-prettier");

    canContinue =
      (await prettifyReadme(options.basePath, options.ci, options.silent)) &&
      (await prettifyPackageJson(options.basePath, options.ci, options.silent)) &&
      (await prettifyPackageDistJson(options.basePath, options.ci, options.silent));
  }

  if (canContinue && options.distfiles) {
    const { buildDistFiles } = await import("@tsparticles/cli-command-build-distfiles");

    canContinue = await buildDistFiles(options.basePath, options.silent);
  }

  if (!canContinue) {
    throw new Error("Build failed");
  }

  let texts: string[] = [],
    outputFunc = console.info;

  if (!options.silent) {
    const newStats = await getDistStats(options.basePath),
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

  if (!options.silent) {
    for (const text of texts) {
      outputFunc(text);
    }
  }
}
