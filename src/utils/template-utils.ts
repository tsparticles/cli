import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

/**
 *
 * @param destPath -
 * @param packageName -
 * @param description -
 * @param fileName -
 * @param repoUrl -
 */
export async function updatePackageFile(
    destPath: string,
    packageName: string,
    description: string,
    fileName: string,
    repoUrl: string
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
 *
 * @param destPath -
 * @param packageName -
 * @param description -
 * @param fileName -
 * @param repoUrl -
 */
export async function updatePackageDistFile(
    destPath: string,
    packageName: string,
    description: string,
    fileName: string,
    repoUrl: string
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
 *
 * @param destPath -
 * @param name -
 * @param description -
 * @param fnName -
 */
export async function updateWebpackFile(
    destPath: string,
    name: string,
    description: string,
    fnName: string
): Promise<void> {
    const webpackPath = path.resolve(destPath, "webpack.config.js"),
        webpack = await fs.readFile(webpackPath, "utf-8"),
        webpackDescriptionRegex = /tsParticles Empty Template/g,
        replacedDescriptionText = webpack.replace(webpackDescriptionRegex, description),
        webpackEntryRegex = /"template(\.bundle)?"/g,
        replacedNameText = replacedDescriptionText.replace(webpackEntryRegex, `"${name}$1"`),
        webpackFunctionNameRegex = /loadParticlesTemplate/g,
        replacedFunctionNameText = replacedNameText.replace(webpackFunctionNameRegex, fnName);

    await fs.writeFile(webpackPath, replacedFunctionNameText);
}

/**
 *
 * @param destPath -
 */
export async function copyEmptyTemplateFiles(destPath: string): Promise<void> {
    const emptyPath = path.resolve(__dirname, "..", "..", "files", "empty-project");

    await fs.copy(emptyPath, destPath, {
        overwrite: true,
        filter: copyFilter,
    });
}

/**
 *
 * @param src -
 * @returns true if the file should be copied
 */
export function copyFilter(src: string): boolean {
    if (src.endsWith("node_modules") || src.endsWith("dist")) {
        return false;
    }

    return true;
}

/**
 *
 * @param destPath -
 */
export function runInstall(destPath: string): void {
    execSync("npm install", {
        cwd: destPath,
    });
}

/**
 *
 * @param destPath -
 */
export function runBuild(destPath: string): void {
    execSync("npm run build", {
        cwd: destPath,
    });
}
