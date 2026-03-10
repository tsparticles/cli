import { opendir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";

export interface IDistStats {
  bundleSize: number;
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
}

/**
 * @param folderPath - the path to the folder to get the stats for
 * @param bundlePath - the bundle path to get the bundle size for
 * @returns the given folder stats;
 */
async function getFolderStats(folderPath: string, bundlePath?: string): Promise<IDistStats> {
  const stats: IDistStats = {
    bundleSize: 0,
    totalFiles: 0,
    totalFolders: 0,
    totalSize: 0,
  };

  if (!existsSync(folderPath)) {
    return stats;
  }

  const dir = await opendir(folderPath),
    path = await import("path");

  for await (const dirent of dir) {
    const increment = 1;

    if (dirent.isDirectory()) {
      const subDirStats = await getFolderStats(path.join(folderPath, dirent.name), bundlePath);

      stats.totalFolders += subDirStats.totalFolders + increment;
      stats.totalFiles += subDirStats.totalFiles;
      stats.totalSize += subDirStats.totalSize;
    } else {
      const fileStats = await stat(path.join(folderPath, dirent.name));

      stats.totalFiles++;
      stats.totalSize += fileStats.size;

      if (bundlePath && path.join(folderPath, dirent.name) === bundlePath) {
        stats.bundleSize += fileStats.size;
      }
    }
  }

  return stats;
}

/**
 * Gets the stats for the dist folder
 * @param basePath - the base path to the project
 * @returns the stats for the dist folder
 */
export async function getDistStats(basePath: string): Promise<IDistStats> {
  const path = await import("path"),
    distFolder = path.join(basePath, "dist"),
    pkgInfo = existsSync(path.join(distFolder, "package.json"))
      ? (JSON.parse((await readFile(path.join(distFolder, "package.json"))).toString()) as {
          jsdelivr?: string;
        })
      : {},
    bundlePath = existsSync(distFolder) && pkgInfo.jsdelivr ? path.join(distFolder, pkgInfo.jsdelivr) : undefined;

  return await getFolderStats(distFolder, bundlePath);
}
