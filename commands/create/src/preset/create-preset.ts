import {
  camelize,
  capitalize,
  copyEmptyTemplateFiles,
  copyFilter,
  dash,
  replaceTokensInFile,
  runBuild,
  runInstall,
  updatePackageDistFile,
  updatePackageFile,
  updateWebpackFile,
} from "@tsparticles/cli-create-utils";
import { cp } from "node:fs/promises";
import path from "node:path";

/**
 * Updates the bundle file with the correct function name
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 */
async function updateBundleFile(destPath: string, name: string): Promise<void> {
  const capitalizedName = capitalize(name, "-", " ");

  await replaceTokensInFile({
    path: path.join(destPath, "src", "bundle.ts"),
    tokens: [
      {
        from: /loadTemplatePreset/g,
        to: `load${capitalizedName}Preset`,
      },
    ],
  });

  await replaceTokensInFile({
    path: path.join(destPath, "src", "bundle.lazy.ts"),
    tokens: [
      {
        from: /loadTemplatePreset/g,
        to: `load${capitalizedName}Preset`,
      },
    ],
  });
}

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
        from: /loadTemplatePreset/g,
        to: `load${capitalizedName}Preset`,
      },
      {
        from: /"#template#"/g,
        to: `"${camelizedName}"`,
      },
    ],
  });

  await replaceTokensInFile({
    path: path.join(destPath, "src", "index.lazy.ts"),
    tokens: [
      {
        from: /loadTemplatePreset/g,
        to: `load${capitalizedName}Preset`,
      },
      {
        from: /"#template#"/g,
        to: `"${camelizedName}"`,
      },
    ],
  });
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
  repoUrl: string,
): Promise<void> {
  const camelizedName = camelize(name, "-", " "),
    dashedName = dash(camelizedName);

  await updatePackageFile(
    destPath,
    `tsparticles-preset-${dashedName}`,
    description,
    `tsparticles.preset.${camelizedName}.min.js`,
    repoUrl,
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
  repoUrl: string,
): Promise<void> {
  const camelizedName = camelize(name, "-", " "),
    dashedName = dash(camelizedName);

  await updatePackageDistFile(
    destPath,
    `tsparticles-preset-${dashedName}`,
    description,
    `tsparticles.preset.${camelizedName}.min.js`,
    repoUrl,
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
  const capitalizedName = capitalize(name, "-", " "),
    camelizedName = camelize(capitalizedName),
    dashedName = dash(camelizedName),
    stringSearch = "github.com",
    trailingSlashSearch = "github.com/",
    repoPath = repoUrl.includes(stringSearch)
      ? repoUrl.substring(repoUrl.indexOf(trailingSlashSearch) + trailingSlashSearch.length, repoUrl.indexOf(".git"))
      : "tsparticles/preset-template";

  await replaceTokensInFile({
    path: path.join(destPath, "README.md"),
    tokens: [
      {
        from: /tsParticles Template Preset/g,
        to: `tsParticles ${description} Preset`,
      },
      {
        from: /tsparticles-preset-template/g,
        to: `tsparticles-preset-${dashedName}`,
      },
      {
        from: /tsparticles\.preset\.template(\.bundle)?\.min\.js/g,
        to: `tsparticles.preset.${camelizedName}$1.min.js`,
      },
      {
        from: /loadTemplatePreset/g,
        to: `load${capitalizedName}Preset`,
      },
      {
        from: /\[tsParticles]\(https:\/\/github.com\/matteobruni\/tsparticles\) preset template\./g,
        to: `[tsParticles](https://github.com/matteobruni/tsparticles) preset ${name}.`,
      },
      {
        from: /preset: "template"/g,
        to: `preset: "${camelizedName}`,
      },
      {
        from: /!\[demo]\(https:\/\/raw.githubusercontent.com\/tsparticles\/preset-template\/main\/images\/sample.png\)/g,
        to: `![demo](https://raw.githubusercontent.com/${repoPath}/main/images/sample.png)`,
      },
    ],
  });
}

/**
 * Updates the preset webpack file
 * @param destPath - The path where the project is located
 * @param name - The name of the project
 * @param description - The description of the project
 */
async function updatePresetWebpackFile(destPath: string, name: string, description: string): Promise<void> {
  await updateWebpackFile(destPath, camelize(capitalize(name, "-", " ")), description, "loadParticlesPreset");
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
  destPath: string,
): Promise<void> {
  const sourcePath = path.join(__dirname, "..", "..", "files", "create-preset");

  await copyEmptyTemplateFiles(destPath);

  await cp(sourcePath, destPath, {
    recursive: true,
    force: true,
    filter: copyFilter,
  });

  await updateBundleFile(destPath, name);
  await updateIndexFile(destPath, name);
  await updatePresetPackageFile(destPath, name, description, repoUrl);
  await updatePresetPackageDistFile(destPath, name, description, repoUrl);
  await updateReadmeFile(destPath, name, description, repoUrl);
  await updatePresetWebpackFile(destPath, name, description);

  await runInstall(destPath);
  await runBuild(destPath);
}
