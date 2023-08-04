import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

/**
 * Updates the package.json file
 * @param destPath - The path where the package.json file is located
 * @param packageName - The name of the package
 * @param description - The description of the package
 * @param fileName - The name of the output file
 * @param repoUrl - The repository URL
 */
export async function updatePackageFile(
    destPath: string,
    packageName: string,
    description: string,
    fileName: string,
    repoUrl: string,
): Promise<void> {
    const packagePath = path.resolve(destPath, "package.json"),
        packageContents = await fs.readFile(packagePath, "utf-8"),
        descriptionRegex = /"tsParticles empty template"/g,
        replacedDescriptionText = packageContents.replace(descriptionRegex, `"${description}"`),
        fileRegex = /"tsparticles.empty.template.min.js"/g,
        replacedFileText = replacedDescriptionText.replace(fileRegex, fileName),
        privateRegex = /\s{4}"private": true,\r?\n?/g,
        replacedPrivateText = replacedFileText.replace(privateRegex, ""),
        nameRegex = /"@tsparticles\/empty-template"/g,
        nameReplacedText = replacedPrivateText.replace(nameRegex, packageName),
        repoUrlRegex = /"url": "git\+https:\/\/github\.com\/tsparticles\/empty-template\.git"/g,
        repoUrlReplacedText = nameReplacedText.replace(repoUrlRegex, `"url": "git+${repoUrl}"`),
        issuesUrlRegex = /"url": "https:\/\/github\.com\/tsparticles\/empty-template\/issues"/g,
        replacedText = repoUrlReplacedText.replace(issuesUrlRegex, `"url": "${repoUrl.replace(".git", "/issues")}"`);

    await fs.writeFile(packagePath, replacedText);
}

/**
 * Updates the package.dist.json file with the new project name and description
 * @param destPath - The path where the package.dist.json file is located
 * @param packageName - The name of the package
 * @param description - The description of the package
 * @param fileName - The name of the output file
 * @param repoUrl - The url of the repository
 */
export async function updatePackageDistFile(
    destPath: string,
    packageName: string,
    description: string,
    fileName: string,
    repoUrl: string,
): Promise<void> {
    const packagePath = path.resolve(destPath, "package.dist.json"),
        packageContents = await fs.readFile(packagePath, "utf-8"),
        descriptionRegex = /"tsParticles empty template"/g,
        replacedDescriptionText = packageContents.replace(descriptionRegex, `"${description}"`),
        fileRegex = /"tsparticles.empty.template.min.js"/g,
        replacedFileText = replacedDescriptionText.replace(fileRegex, fileName),
        privateRegex = /\s{4}"private": true,\r?\n?/g,
        replacedPrivateText = replacedFileText.replace(privateRegex, ""),
        nameRegex = /"@tsparticles\/empty-template"/g,
        nameReplacedText = replacedPrivateText.replace(nameRegex, packageName),
        repoUrlRegex = /"url": "git\+https:\/\/github\.com\/tsparticles\/empty-template\.git"/g,
        repoUrlReplacedText = nameReplacedText.replace(repoUrlRegex, `"url": "git+${repoUrl}"`),
        issuesUrlRegex = /"url": "https:\/\/github\.com\/tsparticles\/empty-template\/issues"/g,
        replacedText = repoUrlReplacedText.replace(issuesUrlRegex, `"url": "${repoUrl.replace(".git", "/issues")}"`);

    await fs.writeFile(packagePath, replacedText);
}

/**
 * Updates the webpack file with the new project name and description
 * @param destPath - The path where the project will be created
 * @param name - The name of the project
 * @param description - The description of the project
 * @param fnName - The name of the function to load the template
 */
export async function updateWebpackFile(
    destPath: string,
    name: string,
    description: string,
    fnName: string,
): Promise<void> {
    const webpackPath = path.resolve(destPath, "webpack.config.js"),
        webpack = await fs.readFile(webpackPath, "utf-8"),
        webpackDescriptionRegex = /"Empty"/g,
        replacedDescriptionText = webpack.replace(webpackDescriptionRegex, `"${description}"`),
        webpackEntryRegex = /"empty"/g,
        replacedNameText = replacedDescriptionText.replace(webpackEntryRegex, `"${name}"`),
        webpackFunctionNameRegex = /loadParticlesTemplate/g,
        replacedFunctionNameText = replacedNameText.replace(webpackFunctionNameRegex, fnName);

    await fs.writeFile(webpackPath, replacedFunctionNameText);
}

/**
 * Copies the empty template files to the destination path
 * @param destPath - The path where the project will be created
 */
export async function copyEmptyTemplateFiles(destPath: string): Promise<void> {
    const emptyPath = path.resolve(__dirname, "..", "..", "files", "empty-project");

    await fs.copy(emptyPath, destPath, {
        overwrite: true,
        filter: copyFilter,
    });
}

/**
 * Filters the files to copy
 * @param src - The source file path
 * @returns true if the file should be copied
 */
export function copyFilter(src: string): boolean {
    return !(src.endsWith("node_modules") || src.endsWith("dist"));
}

/**
 * Runs npm install in the given path
 * @param destPath - The path where the project will be created
 */
export function runInstall(destPath: string): void {
    execSync("npm install", {
        cwd: destPath,
    });
}

/**
 * Runs npm run build in the given path
 * @param destPath - The path where the project will be build
 */
export function runBuild(destPath: string): void {
    execSync("npm run build", {
        cwd: destPath,
    });
}
