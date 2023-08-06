import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

export type ReplaceTokensOptions = {
    path: string;
    tokens: ReplaceTokensData[];
};

export type ReplaceTokensData = {
    from: string | RegExp;
    to: string;
};

/**
 *
 * @param options -
 */
export async function replaceTokensInFiles(options: ReplaceTokensOptions[]): Promise<void> {
    for (const item of options) {
        const filePath = path.resolve(item.path);

        let data = await fs.readFile(filePath, "utf-8");

        for (const token of item.tokens) {
            const regex = new RegExp(token.from, "g");

            data = data.replace(regex, token.to);
        }

        await fs.writeFile(filePath, data);
    }
}

/**
 *
 * @param options -
 */
export async function replaceTokensInFile(options: ReplaceTokensOptions): Promise<void> {
    await replaceTokensInFiles([options]);
}

/**
 *
 * @param destination -
 * @returns the destination directory path
 */
export async function getDestinationDir(destination: string): Promise<string> {
    const destPath = path.resolve(path.join(process.cwd(), destination)),
        destExists = await fs.pathExists(destPath);

    if (destExists) {
        const destContents = await fs.readdir(destPath),
            destContentsNoGit = destContents.filter(t => t !== ".git" && t !== ".gitignore");

        if (destContentsNoGit.length) {
            throw new Error("Destination folder already exists and is not empty");
        }
    }

    await fs.ensureDir(destPath);

    return destPath;
}

/**
 * @returns the repository URL
 */
export function getRepositoryUrl(): string {
    try {
        return execSync("git config --get remote.origin.url").toString();
    } catch {
        return "";
    }
}
