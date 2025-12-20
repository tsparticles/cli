import { exec } from "child_process";
import fs from "fs-extra";
import { lookpath } from "lookpath";
import path from "path";
import { replaceTokensInFile } from "./file-utils.js";

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
    await replaceTokensInFile({
        path: path.join(destPath, "package.json"),
        tokens: [
            {
                from: /"tsParticles empty template"/g,
                to: `"${description}"`,
            },
            {
                from: /"tsparticles.empty.template.min.js"/g,
                to: `"${fileName}"`,
            },
            {
                from: /\s{4}"private": true,\r?\n?/g,
                to: "",
            },
            {
                from: /"@tsparticles\/empty-template"/g,
                to: `"${packageName}"`,
            },
            {
                from: /"url": "git\+https:\/\/github\.com\/tsparticles\/empty-template\.git"/g,
                to: `"url": "git+${repoUrl}"`,
            },
            {
                from: /"url": "https:\/\/github\.com\/tsparticles\/empty-template\/issues"/g,
                to: `"url": "${repoUrl.replace(".git", "/issues")}"`,
            },
        ],
    });
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
    await replaceTokensInFile({
        path: path.join(destPath, "package.dist.json"),
        tokens: [
            {
                from: /"tsParticles empty template"/g,
                to: `"${description}"`,
            },
            {
                from: /"tsparticles.empty.template.min.js"/g,
                to: `"${fileName}"`,
            },
            {
                from: /\s{4}"private": true,\r?\n?/g,
                to: "",
            },
            {
                from: /"@tsparticles\/empty-template"/g,
                to: `"${packageName}"`,
            },
            {
                from: /"url": "git\+https:\/\/github\.com\/tsparticles\/empty-template\.git"/g,
                to: `"url": "git+${repoUrl}"`,
            },
            {
                from: /"url": "https:\/\/github\.com\/tsparticles\/empty-template\/issues"/g,
                to: `"url": "${repoUrl.replace(".git", "/issues")}"`,
            },
        ],
    });
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
    await replaceTokensInFile({
        path: path.join(destPath, "webpack.config.js"),
        tokens: [
            {
                from: /"Empty"/g,
                to: `"${description}"`,
            },
            {
                from: /"empty"/g,
                to: `"${name}"`,
            },
            {
                from: /loadParticlesTemplate/g,
                to: fnName,
            },
        ],
    });
}

/**
 * Copies the empty template files to the destination path
 * @param destPath - The path where the project will be created
 */
export async function copyEmptyTemplateFiles(destPath: string): Promise<void> {
    await fs.copy(path.join(__dirname, "..", "..", "files", "empty-project"), destPath, {
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
export async function runInstall(destPath: string): Promise<void> {
    if (!(await lookpath("npm"))) {
        return;
    }

    return new Promise((resolve, reject) => {
        exec(
            "npm install",
            {
                cwd: destPath,
            },
            error => {
                if (error) {
                    reject(error);

                    return;
                }

                resolve();
            },
        );
    });
}

/**
 * Runs npm run build in the given path
 * @param destPath - The path where the project will be build
 */
export async function runBuild(destPath: string): Promise<void> {
    if (!(await lookpath("npm"))) {
        return;
    }

    return new Promise((resolve, reject) => {
        exec(
            "npm run build",
            {
                cwd: destPath,
            },
            error => {
                if (error) {
                    reject(error);

                    return;
                }

                resolve();
            },
        );
    });
}
