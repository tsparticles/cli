import { exec } from "child_process";
import fs from "fs-extra";
import { lookpath } from "lookpath";
import path from "path";

export interface ReplaceTokensOptions {
    path: string;
    tokens: ReplaceTokensData[];
}

export interface ReplaceTokensData {
    from: string | RegExp;
    to: string;
}

/**
 *
 * @param options -
 */
export async function replaceTokensInFiles(options: ReplaceTokensOptions[]): Promise<void> {
    for (const item of options) {
        const filePath = item.path;

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
    const destPath = path.join(process.cwd(), destination),
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
export async function getRepositoryUrl(): Promise<string> {
    if (!(await lookpath("git"))) {
        return "";
    }

    return new Promise<string>((resolve, reject) => {
        exec("git config --get remote.origin.url", (error, stdout) => {
            if (error) {
                reject(error);

                return;
            }

            resolve(stdout);
        });
    });
}
