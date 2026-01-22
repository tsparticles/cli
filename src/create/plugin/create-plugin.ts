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
        from: /loadTemplatePlugin/g,
        to: `load${capitalizedName}Plugin`,
      },
      {
        from: /"#template#"/g,
        to: `"${camelizedName}"`,
      },
    ],
  });
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

  await updatePackageFile(
    destPath,
    `tsparticles-plugin-${dashedName}`,
    description,
    `tsparticles.plugin.${camelizedName}.min.js`,
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

  await updatePackageDistFile(
    destPath,
    `tsparticles-plugin-${dashedName}`,
    description,
    `tsparticles.plugin.${camelizedName}.min.js`,
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
  const readmePath = path.join(destPath, "README.md"),
    capitalizedName = capitalize(name, "-", " "),
    camelizedName = camelize(capitalizedName),
    dashedName = dash(camelizedName),
    stringSearch = "github.com",
    trailingSlashSearch = "github.com/",
    repoPath = repoUrl.includes(stringSearch)
      ? repoUrl.substring(repoUrl.indexOf(trailingSlashSearch) + trailingSlashSearch.length, repoUrl.indexOf(".git"))
      : "tsparticles/plugin-template";

  await replaceTokensInFile({
    path: readmePath,
    tokens: [
      {
        from: /tsParticles Template Plugin/g,
        to: `tsParticles ${description} Plugin`,
      },
      {
        from: /tsparticles-plugin-template/g,
        to: `tsparticles-plugin-${dashedName}`,
      },
      {
        from: /tsparticles\.plugin\.template(\.bundle)?\.min\.js/g,
        to: `tsparticles.plugin.${camelizedName}$1.min.js`,
      },
      {
        from: /loadTemplatePlugin/g,
        to: `load${capitalizedName}Plugin`,
      },
      {
        from: /\[tsParticles]\(https:\/\/github.com\/matteobruni\/tsparticles\) additional template plugin\./g,
        to: `[tsParticles](https://github.com/matteobruni/tsparticles) additional ${name} plugin.`,
      },
      {
        from: /plugin\.type: "template"/g,
        to: `plugin.type: "${camelizedName}"`,
      },
      {
        from: /!\[demo]\(https:\/\/raw.githubusercontent.com\/tsparticles\/plugin-template\/main\/images\/sample.png\)/g,
        to: `![demo](https://raw.githubusercontent.com/${repoPath}/main/images/sample.png)`,
      },
    ],
  });
}

/**
 * Updates the plugin webpack file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 */
async function updatePluginWebpackFile(destPath: string, name: string, description: string): Promise<void> {
  await updateWebpackFile(destPath, camelize(capitalize(name, "-", " ")), description, "loadParticlesPlugin");
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
  const sourcePath = path.join(__dirname, "..", "..", "..", "files", "create-plugin");

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
  await runInstall(destPath);
  await runBuild(destPath);
}
