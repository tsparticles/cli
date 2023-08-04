import { camelize, capitalize, dash } from "../../utils/string-utils";
import {
    copyEmptyTemplateFiles,
    copyFilter,
    runBuild,
    runInstall,
    updatePackageDistFile,
    updatePackageFile,
    updateWebpackFile,
} from "../../utils/template-utils";
import fs from "fs-extra";
import path from "path";

/**
 * Updates the index file with the correct function name
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 */
async function updateIndexFile(destPath: string, name: string): Promise<void> {
    const indexPath = path.resolve(destPath, "src", "index.ts"),
        index = await fs.readFile(indexPath, "utf-8"),
        capitalizedName = capitalize(capitalize(name, "-"), " "),
        camelizedName = camelize(capitalizedName),
        indexFunctionRegex = /loadTemplateShape/g,
        replacedFuncText = index.replace(indexFunctionRegex, `load${capitalizedName}Shape`),
        indexNameRegex = /"#template#"/g,
        replacedNameText = replacedFuncText.replace(indexNameRegex, `"${camelizedName}"`);

    await fs.writeFile(indexPath, replacedNameText);
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

    updatePackageFile(
        destPath,
        `"tsparticles-shape-${dashedName}"`,
        description,
        `"tsparticles.shape.${camelizedName}.min.js"`,
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
        `"tsparticles-shape-${dashedName}"`,
        description,
        `"tsparticles.shape.${camelizedName}.min.js"`,
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
    const readmePath = path.resolve(destPath, "README.md"),
        readme = await fs.readFile(readmePath, "utf-8"),
        capitalizedName = capitalize(capitalize(name, "-"), " "),
        camelizedName = camelize(capitalizedName),
        dashedName = dash(camelizedName),
        readmeDescriptionRegex = /tsParticles Template Shape/g,
        replacedDescriptionText = readme.replace(readmeDescriptionRegex, `tsParticles ${description} Shape`),
        readmePackageNameRegex = /tsparticles-shape-template/g,
        replacedPackageNameText = replacedDescriptionText.replace(
            readmePackageNameRegex,
            `tsparticles-shape-${dashedName}`,
        ),
        readmeFileNameRegex = /tsparticles\.shape\.template(\.bundle)?\.min\.js/g,
        replacedFileNameText = replacedPackageNameText.replace(
            readmeFileNameRegex,
            `tsparticles.shape.${camelizedName}$1.min.js`,
        ),
        readmeFunctionNameRegex = /loadTemplateShape/g,
        replacedFunctionNameText = replacedFileNameText.replace(readmeFunctionNameRegex, `load${capitalizedName}Shape`),
        readmeMiniDescriptionRegex =
            /\[tsParticles]\(https:\/\/github.com\/matteobruni\/tsparticles\) additional template shape\./g,
        replacedMiniDescriptionText = replacedFunctionNameText.replace(
            readmeMiniDescriptionRegex,
            `[tsParticles](https://github.com/matteobruni/tsparticles) additional ${name} shape.`,
        ),
        readmeUsageRegex = /shape\.type: "template"/g,
        replacedUsageText = replacedMiniDescriptionText.replace(readmeUsageRegex, `shape.type: "${camelizedName}`),
        sampleImageRegex =
            /!\[demo]\(https:\/\/raw.githubusercontent.com\/tsparticles\/shape-template\/main\/images\/sample.png\)/g,
        repoPath = repoUrl.includes("github.com")
            ? repoUrl.substring(repoUrl.indexOf("github.com/") + 11, repoUrl.indexOf(".git"))
            : "tsparticles/shape-template",
        replacedText = replacedUsageText.replace(
            sampleImageRegex,
            `![demo](https://raw.githubusercontent.com/${repoPath}/main/images/sample.png)`,
        );

    await fs.writeFile(readmePath, replacedText);
}

/**
 * Updates the shape webpack file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 */
async function updateShapeWebpackFile(destPath: string, name: string, description: string): Promise<void> {
    await updateWebpackFile(
        destPath,
        camelize(capitalize(capitalize(name, "-"), " ")),
        description,
        "loadParticlesShape",
    );
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
    const sourcePath = path.resolve(__dirname, "..", "..", "..", "files", "create-shape");

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

    runInstall(destPath);
    runBuild(destPath);
}
