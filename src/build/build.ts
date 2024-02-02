import { Command } from "commander";

const buildCommand = new Command("build");

buildCommand.description("Build the tsParticles library using TypeScript");
buildCommand.option(
    "-a, --all",
    "Do all build steps (default if no flags are specified) (same as -b -c -d -l -p -t)",
    false,
);
buildCommand.option("-b, --bundle", "Bundle the library using Webpack", false);
buildCommand.option("-c, --clean", "Clean the dist folder", false);
buildCommand.option(
    "--ci",
    "Do all build steps for CI, no fixing files, only checking if they are formatted correctly",
    false,
);
buildCommand.option("-cd, --circular-deps", "Check for circular dependencies", false);
buildCommand.option("-d, --dist", "Build the dist files", false);
buildCommand.option("-l, --lint", "Lint the source files", false);
buildCommand.option("-p, --prettify", "Prettify the source files", false);
buildCommand.option("-t, --tsc", "Build the library using TypeScript", false);

buildCommand.argument("[path]", `Path to the project root folder, default is "src"`, "src");
buildCommand.action(async (argPath: string) => {
    const opts = buildCommand.opts(),
        ci = !!opts.ci,
        all = !!opts.all || (!opts.bundle && !opts.clean && !opts.dist && !opts.lint && !opts.prettify && !opts.tsc),
        doBundle = all || !!opts.bundle,
        circularDeps = all || !!opts.circularDeps,
        clean = all || !!opts.clean,
        distfiles = all || !!opts.dist,
        doLint = all || !!opts.lint,
        prettier = all || !!opts.prettify,
        tsc = all || !!opts.tsc;

    const basePath = process.cwd(),
        { getDistStats } = await import("./build-diststats.js"),
        oldStats = await getDistStats(basePath);

    if (clean) {
        const { clearDist } = await import("./build-clear.js");

        await clearDist(basePath);
    }

    const path = await import("path"),
        srcPath = path.join(basePath, argPath),
        fs = await import("fs-extra");

    if (!(await fs.pathExists(srcPath))) {
        throw new Error("Provided path does not exist");
    }

    let canContinue = true;

    if (canContinue && prettier) {
        const { prettifySrc } = await import("./build-prettier.js");

        canContinue = await prettifySrc(basePath, srcPath, ci);
    }

    if (canContinue && doLint) {
        const { lint } = await import("./build-eslint.js");

        canContinue = await lint(ci);
    }

    if (canContinue && tsc) {
        const { buildTS } = await import("./build-tsc.js");

        canContinue = await buildTS(basePath);
    }

    if (canContinue && circularDeps) {
        const { buildCircularDeps } = await import("./build-circular-deps.js");

        canContinue = await buildCircularDeps(basePath);
    }

    if (canContinue && doBundle) {
        const { bundle } = await import("./build-bundle.js");

        canContinue = await bundle(basePath);
    }

    if (canContinue && prettier) {
        const { prettifyReadme, prettifyPackageJson, prettifyPackageDistJson } = await import("./build-prettier");

        canContinue = await prettifyReadme(basePath, ci);
        canContinue = await prettifyPackageJson(basePath, ci);
        canContinue = await prettifyPackageDistJson(basePath, ci);
    }

    if (canContinue && distfiles) {
        const { buildDistFiles } = await import("./build-distfiles.js");

        canContinue = await buildDistFiles(basePath);
    }

    if (!canContinue) {
        throw new Error("Build failed");
    }

    const newStats = await getDistStats(basePath),
        diffSize = newStats.totalSize - oldStats.totalSize,
        bundleDiffSize = newStats.bundleSize - oldStats.bundleSize,
        minSize = 0,
        bundleSizeIncreased = bundleDiffSize > minSize,
        outputFunc = bundleSizeIncreased ? console.warn : console.info,
        texts = [
            !bundleDiffSize
                ? "Bundle size unchanged"
                : `Bundle size ${bundleSizeIncreased ? "increased" : "decreased"} from ${oldStats.bundleSize} to ${
                      newStats.bundleSize
                  } (${Math.abs(bundleDiffSize)}B)`,
            !diffSize
                ? "Size unchanged"
                : `Size ${diffSize > minSize ? "increased" : "decreased"} from ${oldStats.totalSize} to ${
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
