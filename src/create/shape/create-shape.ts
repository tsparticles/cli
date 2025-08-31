import { camelize, capitalize, dash } from "../../utils/string-utils.js";
import {
    copyEmptyTemplateFiles,
    copyFilter,
    runBuild,
    runInstall,
    updatePackageDistFile,
    updatePackageFile,
    updateWebpackFile,
} from "../../utils/template-utils.js";
import fs from "fs-extra";
import path from "path";
import { replaceTokensInFile } from "../../utils/file-utils.js";

/**
 * Updates the index file with the correct function name
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 */
async function updateIndexFile(destPath: string, name: string): Promise<void> {
    const capitalizedName = capitalize(name, "-", " "),
        camelizedName = camelize(capitalizedName);

    await replaceTokensInFile({
        path: path.join(destPath, "src", "index.ts"),
        tokens: [
            {
                from: /loadTemplateShape/g,
                to: `load${capitalizedName}Shape`,
            },
            {
                from: /"#template#"/g,
                to: `"${camelizedName}"`,
            },
        ],
    });
}

/**
 * Updates the shape package file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 */
async function updateShapePackageFile(
    destPath: string,
    name: string,
    description: string,
    repoUrl: string,
): Promise<void> {
    const camelizedName = camelize(camelize(name, "-"), " "),
        dashedName = dash(camelizedName);

    await updatePackageFile(
        destPath,
        `tsparticles-shape-${dashedName}`,
        description,
        `tsparticles.shape.${camelizedName}.min.js`,
        repoUrl,
    );
}

/**
 * Updates the shape package dist file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 */
async function updateShapePackageDistFile(
    destPath: string,
    name: string,
    description: string,
    repoUrl: string,
): Promise<void> {
    const camelizedName = camelize(camelize(name, "-"), " "),
        dashedName = dash(camelizedName);

    await updatePackageDistFile(
        destPath,
        `tsparticles-shape-${dashedName}`,
        description,
        `tsparticles.shape.${camelizedName}.min.js`,
        repoUrl,
    );
}

/**
 * Updates the shape readme file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 */
async function updateReadmeFile(destPath: string, name: string, description: string, repoUrl: string): Promise<void> {
    const capitalizedName = capitalize(name, "-", " "),
        camelizedName = camelize(capitalizedName),
        dashedName = dash(camelizedName),
        stringSearch = "github.com",
        trailingSlashSearch = "github.com/",
        repoPath = repoUrl.includes(stringSearch)
            ? repoUrl.substring(
                  repoUrl.indexOf(trailingSlashSearch) + trailingSlashSearch.length,
                  repoUrl.indexOf(".git"),
              )
            : "tsparticles/shape-template";

    await replaceTokensInFile({
        path: path.join(destPath, "README.md"),
        tokens: [
            {
                from: /tsParticles Template Shape/g,
                to: `tsParticles ${description} Shape`,
            },
            {
                from: /tsparticles-shape-template/g,
                to: `tsparticles-shape-${dashedName}`,
            },
            {
                from: /tsparticles\.shape\.template(\.bundle)?\.min\.js/g,
                to: `tsparticles.shape.${camelizedName}$1.min.js`,
            },
            {
                from: /loadTemplateShape/g,
                to: `load${capitalizedName}Shape`,
            },
            {
                from: /\[tsParticles]\(https:\/\/github.com\/matteobruni\/tsparticles\) additional template shape\./g,
                to: `[tsParticles](https://github.com/matteobruni/tsparticles) additional ${name} shape.`,
            },
            {
                from: /shape\.type: "template"/g,
                to: `shape.type: "${camelizedName}`,
            },
            {
                from: /!\[demo]\(https:\/\/raw.githubusercontent.com\/tsparticles\/shape-template\/main\/images\/sample.png\)/g,
                to: `![demo](https://raw.githubusercontent.com/${repoPath}/main/images/sample.png)`,
            },
        ],
    });
}

/**
 * Updates the shape webpack file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 */
async function updateShapeWebpackFile(destPath: string, name: string, description: string): Promise<void> {
    await updateWebpackFile(destPath, camelize(capitalize(name, "-", " ")), description, "loadParticlesShape");
}

/**
 * Creates the shape project
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 * @param destPath - The path where the project is located
 */
export async function createShapeTemplate(
    name: string,
    description: string,
    repoUrl: string,
    destPath: string,
): Promise<void> {
    const sourcePath = path.join(__dirname, "..", "..", "..", "files", "create-shape");

    await copyEmptyTemplateFiles(destPath);

    await fs.copy(sourcePath, destPath, {
        overwrite: true,
        filter: copyFilter,
    });

    await updateIndexFile(destPath, name);
    await updateShapePackageFile(destPath, name, description, repoUrl);
    await updateShapePackageDistFile(destPath, name, description, repoUrl);
    await updateReadmeFile(destPath, name, description, repoUrl);
    await updateShapeWebpackFile(destPath, name, description);

    await runInstall(destPath);
    await runBuild(destPath);
}
