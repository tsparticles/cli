import fs from "fs-extra";
import path from "path";

export interface IDistStats {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
}

/**
 * @param folderPath - the path to the folder to get the stats for
 * @returns the given folder stats;
 */
async function getFolderStats(folderPath: string): Promise<IDistStats> {
    const stats: IDistStats = {
        totalFiles: 0,
        totalFolders: 0,
        totalSize: 0,
    };

    const dir = await fs.promises.opendir(folderPath);

    for await (const dirent of dir) {
        if (dirent.isDirectory()) {
            const subDirStats = await getFolderStats(path.join(folderPath, dirent.name));

            stats.totalFolders += subDirStats.totalFolders + 1;
            stats.totalFiles += subDirStats.totalFiles;
            stats.totalSize += subDirStats.totalSize;
        } else {
            const fileStats = await fs.stat(path.join(folderPath, dirent.name));

            stats.totalFiles++;
            stats.totalSize += fileStats.size;
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
    return await getFolderStats(path.join(basePath, "dist"));
}
