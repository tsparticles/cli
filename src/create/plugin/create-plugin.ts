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
        indexFunctionRegex = /loadTemplatePlugin/g,
        replacedFuncText = index.replace(indexFunctionRegex, `load${capitalizedName}Plugin`),
        indexNameRegex = /"#template#"/g,
        replacedNameText = replacedFuncText.replace(indexNameRegex, `"${camelizedName}"`);

    await fs.writeFile(indexPath, replacedNameText);
}

/**
 * Updates the plugin package file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 */
async function updatePluginPackageFile(
    destPath: string,
    name: string,
    description: string,
    repoUrl: string,
): Promise<void> {
    const camelizedName = camelize(camelize(name, "-"), " "),
        dashedName = dash(camelizedName);

    updatePackageFile(
        destPath,
        `"tsparticles-plugin-${dashedName}"`,
        description,
        `"tsparticles.plugin.${camelizedName}.min.js"`,
        repoUrl,
    );
}

/**
 * Updates the plugin package dist file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 */
async function updatePluginPackageDistFile(
    destPath: string,
    name: string,
    description: string,
    repoUrl: string,
): Promise<void> {
    const camelizedName = camelize(camelize(name, "-"), " "),
        dashedName = dash(camelizedName);

    updatePackageDistFile(
        destPath,
        `"tsparticles-plugin-${dashedName}"`,
        description,
        `"tsparticles.plugin.${camelizedName}.min.js"`,
        repoUrl,
    );
}

/**
 * Updates the plugin readme file
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
        readmeDescriptionRegex = /tsParticles Template Plugin/g,
        replacedDescriptionText = readme.replace(readmeDescriptionRegex, `tsParticles ${description} Plugin`),
        readmePackageNameRegex = /tsparticles-plugin-template/g,
        replacedPackageNameText = replacedDescriptionText.replace(
            readmePackageNameRegex,
            `tsparticles-plugin-${dashedName}`,
        ),
        readmeFileNameRegex = /tsparticles\.plugin\.template(\.bundle)?\.min\.js/g,
        replacedFileNameText = replacedPackageNameText.replace(
            readmeFileNameRegex,
            `tsparticles.plugin.${camelizedName}$1.min.js`,
        ),
        readmeFunctionNameRegex = /loadTemplatePlugin/g,
        replacedFunctionNameText = replacedFileNameText.replace(
            readmeFunctionNameRegex,
            `load${capitalizedName}Plugin`,
        ),
        readmeMiniDescriptionRegex =
            /\[tsParticles]\(https:\/\/github.com\/matteobruni\/tsparticles\) additional template plugin\./g,
        replacedMiniDescriptionText = replacedFunctionNameText.replace(
            readmeMiniDescriptionRegex,
            `[tsParticles](https://github.com/matteobruni/tsparticles) additional ${name} plugin.`,
        ),
        readmeUsageRegex = /plugin\.type: "template"/g,
        replacedUsageText = replacedMiniDescriptionText.replace(readmeUsageRegex, `plugin.type: "${camelizedName}`),
        sampleImageRegex =
            /!\[demo]\(https:\/\/raw.githubusercontent.com\/tsparticles\/plugin-template\/main\/images\/sample.png\)/g,
        repoPath = repoUrl.includes("github.com")
            ? repoUrl.substring(repoUrl.indexOf("github.com/") + 11, repoUrl.indexOf(".git"))
            : "tsparticles/plugin-template",
        replacedText = replacedUsageText.replace(
            sampleImageRegex,
            `![demo](https://raw.githubusercontent.com/${repoPath}/main/images/sample.png)`,
        );

    await fs.writeFile(readmePath, replacedText);
}

/**
 * Updates the plugin webpack file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 */
async function updatePluginWebpackFile(destPath: string, name: string, description: string): Promise<void> {
    await updateWebpackFile(
        destPath,
        camelize(capitalize(capitalize(name, "-"), " ")),
        `tsParticles ${description} Plugin`,
        "loadParticlesPlugin",
    );
}

/**
 * Creates the plugin project
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 * @param destPath - The path where the project is located
 */
export async function createPluginTemplate(
    name: string,
    description: string,
    repoUrl: string,
    destPath: string,
): Promise<void> {
    const sourcePath = path.resolve(__dirname, "..", "..", "..", "files", "create-plugin");

    await copyEmptyTemplateFiles(destPath);

    await fs.copy(sourcePath, destPath, {
        overwrite: true,
        filter: copyFilter,
    });

    await updateIndexFile(destPath, name);
    await updatePluginPackageFile(destPath, name, description, repoUrl);
    await updatePluginPackageDistFile(destPath, name, description, repoUrl);
    await updateReadmeFile(destPath, name, description, repoUrl);
    await updatePluginWebpackFile(destPath, name, description);

    runInstall(destPath);
    runBuild(destPath);
}
