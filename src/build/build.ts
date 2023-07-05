import { prettifyReadme, prettifySrc } from "./build-prettier";
import { Command } from "commander";
import { buildDistFiles } from "./build-distfiles";
import { buildTS } from "./build-tsc";
import { bundle } from "./build-bundle";
import { clearDist } from "./build-clear";
import fs from "fs-extra";
import { getDistStats } from "./build-diststats";
import { lint } from "./build-eslint";
import path from "path";

const buildCommand = new Command("build");

buildCommand.description("Build the library using TypeScript");
buildCommand.option(
    "-a, --all",
    "Do all build steps (default if no flags are specified) (same as -b -c -d -l -p -t)",
    true,
);
buildCommand.option("-b, --bundle", "Bundle the library using Webpack", false);
buildCommand.option("-c, --clean", "Clean the dist folder", false);
buildCommand.option(
    "--ci",
    "Do all build steps for CI, no fixing files, only checking if they are formatted correctly",
    false,
);
buildCommand.option("-d, --dist", "Build the dist files", false);
buildCommand.option("-l, --lint", "Lint the source files", false);
buildCommand.option("-p, --prettify", "Prettify the source files", false);
buildCommand.option("-t, --tsc", "Build the library using TypeScript", false);

buildCommand.argument("[path]", `Path to the project root folder, default is "src"`, "src");
buildCommand.action(async (argPath: string) => {
    const opts = buildCommand.opts(),
        ci = !!opts.ci,
        all = !!opts.all,
        doBundle = all || !!opts.bundle,
        clean = all || !!opts.clean,
        distfiles = all || !!opts.dist,
        doLint = all || !!opts.lint,
        prettier = all || !!opts.prettify,
        tsc = all || !!opts.tsc;

    const basePath = process.cwd(),
        oldStats = await getDistStats(basePath);

    if (clean) {
        await clearDist(basePath);
    }

    const srcPath = path.join(basePath, argPath);

    if (!(await fs.pathExists(srcPath))) {
        throw new Error("Provided path does not exist");
    }

    let canContinue = true;

    if (canContinue && prettier) {
        canContinue = await prettifySrc(basePath, srcPath, ci);
    }

    if (canContinue && doLint) {
        canContinue = await lint(ci);
    }

    if (canContinue && tsc) {
        canContinue = await buildTS(basePath);
    }

    if (canContinue && doBundle) {
        canContinue = await bundle(basePath);
    }

    if (canContinue && prettier) {
        canContinue = await prettifyReadme(basePath, ci);
    }

    if (canContinue && distfiles) {
        canContinue = await buildDistFiles(basePath);
    }

    if (!canContinue) {
        throw new Error("Build failed");
    }

    const newStats = await getDistStats(basePath),
        diffSize = newStats.totalSize - oldStats.totalSize,
        bundleDiffSize = newStats.bundleSize - oldStats.bundleSize,
        bundleSizeIncreased = bundleDiffSize > 0,
        outputFunc = bundleSizeIncreased ? console.warn : console.info,
        texts = [
            !bundleDiffSize
                ? "Bundle size unchanged"
                : `Bundle size ${bundleSizeIncreased ? "increased" : "decreased"} from ${oldStats.bundleSize} to ${
                      newStats.bundleSize
                  } (${Math.abs(bundleDiffSize)}B)`,
            !diffSize
                ? "Size unchanged"
                : `Size ${diffSize > 0 ? "increased" : "decreased"} from ${oldStats.totalSize} to ${
                      newStats.totalSize
                  } (${Math.abs(diffSize)}B)`,
            `Files count changed from ${oldStats.totalFiles} to ${newStats.totalFiles} (${
                newStats.totalFiles - oldStats.totalFiles
            })`,
            `Folders count changed from ${oldStats.totalFolders} to ${newStats.totalFolders} (${
                newStats.totalFolders - oldStats.totalFolders
            })`,
        ];

    console.log("Build finished successfully!");

    for (const text of texts) {
        outputFunc(text);
    }
});

export { buildCommand };
