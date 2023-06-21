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
 * Updates the bundle file with the correct function name
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 */
async function updateBundleFile(destPath: string, name: string): Promise<void> {
    const bundlePath = path.resolve(destPath, "src", "bundle.ts"),
        bundle = await fs.readFile(bundlePath, "utf-8"),
        capitalizedName = capitalize(capitalize(name, "-"), " "),
        bundleRegex = /loadTemplatePreset/g,
        replacedText = bundle.replace(bundleRegex, `load${capitalizedName}Preset`);

    await fs.writeFile(bundlePath, replacedText);
}

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
        indexFunctionRegex = /loadTemplatePreset/g,
        replacedFuncText = index.replace(indexFunctionRegex, `load${capitalizedName}Preset`),
        indexNameRegex = /"#template#"/g,
        replacedNameText = replacedFuncText.replace(indexNameRegex, `"${camelizedName}"`);

    await fs.writeFile(indexPath, replacedNameText);
}

/**
 * Updates the preset package file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 */
async function updatePresetPackageFile(
    destPath: string,
    name: string,
    description: string,
    repoUrl: string
): Promise<void> {
    const camelizedName = camelize(camelize(name, "-"), " "),
        dashedName = dash(camelizedName);

    updatePackageFile(
        destPath,
        `"tsparticles-preset-${dashedName}"`,
        description,
        `"tsparticles.preset.${camelizedName}.min.js"`,
        repoUrl
    );
}

/**
 * Updates the preset package dist file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 */
async function updatePresetPackageDistFile(
    destPath: string,
    name: string,
    description: string,
    repoUrl: string
): Promise<void> {
    const camelizedName = camelize(camelize(name, "-"), " "),
        dashedName = dash(camelizedName);

    updatePackageDistFile(
        destPath,
        `"tsparticles-preset-${dashedName}"`,
        description,
        `"tsparticles.preset.${camelizedName}.min.js"`,
        repoUrl
    );
}

/**
 * Updates the preset readme file
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
        readmeDescriptionRegex = /tsParticles Template Preset/g,
        replacedDescriptionText = readme.replace(readmeDescriptionRegex, `tsParticles ${description} Preset`),
        readmePackageNameRegex = /tsparticles-preset-template/g,
        replacedPackageNameText = replacedDescriptionText.replace(
            readmePackageNameRegex,
            `tsparticles-preset-${dashedName}`
        ),
        readmeFileNameRegex = /tsparticles\.preset\.template(\.bundle)?\.min\.js/g,
        replacedFileNameText = replacedPackageNameText.replace(
            readmeFileNameRegex,
            `tsparticles.preset.${camelizedName}$1.min.js`
        ),
        readmeFunctionNameRegex = /loadTemplatePreset/g,
        replacedFunctionNameText = replacedFileNameText.replace(
            readmeFunctionNameRegex,
            `load${capitalizedName}Preset`
        ),
        readmeMiniDescriptionRegex =
            /\[tsParticles]\(https:\/\/github.com\/matteobruni\/tsparticles\) preset template\./g,
        replacedMiniDescriptionText = replacedFunctionNameText.replace(
            readmeMiniDescriptionRegex,
            `[tsParticles](https://github.com/matteobruni/tsparticles) preset ${name}.`
        ),
        readmeUsageRegex = /preset: "template"/g,
        replacedUsageText = replacedMiniDescriptionText.replace(readmeUsageRegex, `preset: "${camelizedName}`),
        sampleImageRegex =
            /!\[demo]\(https:\/\/raw.githubusercontent.com\/tsparticles\/preset-template\/main\/images\/sample.png\)/g,
        repoPath = repoUrl.includes("github.com")
            ? repoUrl.substring(repoUrl.indexOf("github.com/") + 11, repoUrl.indexOf(".git"))
            : "tsparticles/preset-template",
        replacedText = replacedUsageText.replace(
            sampleImageRegex,
            `![demo](https://raw.githubusercontent.com/${repoPath}/main/images/sample.png)`
        );

    await fs.writeFile(readmePath, replacedText);
}

/**
 * Updates the preset webpack file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 */
async function updatePresetWebpackFile(destPath: string, name: string, description: string): Promise<void> {
    await updateWebpackFile(
        destPath,
        camelize(capitalize(capitalize(name, "-"), " ")),
        `tsParticles ${description} Preset`,
        "loadParticlesPreset"
    );
}

/**
 * Creates the preset project
 * @param name - The name of the project
 * @param description - The description of the project
 * @param repoUrl - The repository url
 * @param destPath - The path where the project is located
 */
export async function createPresetTemplate(
    name: string,
    description: string,
    repoUrl: string,
    destPath: string
): Promise<void> {
    const sourcePath = path.resolve(__dirname, "..", "..", "..", "files", "create-preset");

    await copyEmptyTemplateFiles(destPath);

    await fs.copy(sourcePath, destPath, {
        overwrite: true,
        filter: copyFilter,
    });

    await updateBundleFile(destPath, name);
    await updateIndexFile(destPath, name);
    await updatePresetPackageFile(destPath, name, description, repoUrl);
    await updatePresetPackageDistFile(destPath, name, description, repoUrl);
    await updateReadmeFile(destPath, name, description, repoUrl);
    await updatePresetWebpackFile(destPath, name, description);

    runInstall(destPath);
    runBuild(destPath);
}
