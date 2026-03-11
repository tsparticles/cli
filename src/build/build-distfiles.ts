import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import klaw from "klaw";
import path from "node:path";

/**
 * @param basePath -
 * @param silent -
 * @returns true if the dist files process was successful
 */
export async function buildDistFiles(basePath: string, silent: boolean): Promise<boolean> {
  if (!silent) {
    console.log("Build - started on dist files");
  }

  let res: boolean;

  try {
    const pkgInfo = JSON.parse((await readFile(path.join(basePath, "package.json"))).toString()) as {
        dependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
        publishConfig?: { directory?: string };
        version: string;
      },
      libPackage = path.join(basePath, "package.dist.json"),
      distPath = path.join(basePath, pkgInfo.publishConfig?.directory ?? "dist"),
      data = await readFile(libPackage),
      text = data.toString(),
      libObj = JSON.parse(text) as Record<string, unknown>;

    libObj["version"] = pkgInfo.version;

    if (pkgInfo.dependencies) {
      libObj["dependencies"] = JSON.parse(JSON.stringify(pkgInfo.dependencies).replaceAll("workspace:", ""));
    } else if (pkgInfo.peerDependencies) {
      libObj["peerDependencies"] = JSON.parse(JSON.stringify(pkgInfo.peerDependencies).replaceAll("workspace:", ""));
    }

    const jsonIndent = 2,
      newLibPackageContents = `${JSON.stringify(libObj, undefined, jsonIndent)}\n`;

    if (newLibPackageContents !== text) {
      await writeFile(libPackage, newLibPackageContents, "utf8");
    }

    if (!silent) {
      console.log(`package.dist.json updated successfully to version ${pkgInfo.version}`);
    }

    const rootFilesToCopy = [
      "LICENSE",
      "README.md",
      {
        source: "package.dist.json",
        destination: "package.json",
      },
    ];

    for (const file of rootFilesToCopy) {
      const src = path.join(basePath, typeof file === "string" ? file : file.source),
        dest = path.join(distPath, typeof file === "string" ? file : file.destination);

      await copyFile(src, dest);
    }

    const scriptsPath = path.join(basePath, "scripts"),
      distScriptsPath = path.join(distPath, "scripts");

    if (existsSync(scriptsPath) && !existsSync(distScriptsPath)) {
      await mkdir(distScriptsPath, { recursive: true });

      const installPath = path.join(scriptsPath, "install.js");

      if (existsSync(installPath)) {
        await copyFile(installPath, path.join(distScriptsPath, "install.js"));
      }
    }

    for await (const file of klaw(distPath)) {
      if (file.stats.isDirectory()) {
        continue;
      }

      const contents = await readFile(file.path, "utf8"),
        updatedContents = contents.replaceAll("__VERSION__", `"${pkgInfo.version}"`);

      if (updatedContents !== contents) {
        await writeFile(file.path, updatedContents, "utf8");
      }
    }

    /* for await (const file of klaw(path.join(distPath, "cjs"))) {
            await fs.rename(file.path, file.path.replace(/\.js$/, ".cjs"));
        }

        for await (const file of klaw(path.join(distPath, "esm"))) {
            await fs.rename(file.path, file.path.replace(/\.js$/, ".mjs"));
        } */

    await writeFile(path.join(distPath, "cjs", "package.json"), `{ "type": "commonjs" }`);
    await writeFile(path.join(distPath, "esm", "package.json"), `{ "type": "module" }`);
    await writeFile(path.join(distPath, "browser", "package.json"), `{ "type": "module" }`);

    res = true;
  } catch (e) {
    console.error(e);

    res = false;
  }

  if (!silent) {
    console.log("Build - done on dist files");
  }

  return res;
}
