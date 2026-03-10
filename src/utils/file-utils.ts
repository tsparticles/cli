import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import { lookpath } from "lookpath";
import path from "node:path";

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

    let data = await readFile(filePath, "utf-8");

    for (const token of item.tokens) {
      const regex = token.from instanceof RegExp ? token.from : new RegExp(token.from, "g");

      data = data.replace(regex, token.to);
    }

    await writeFile(filePath, data);
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
    destExists = existsSync(destPath);

  if (destExists) {
    const destContents = await readdir(destPath),
      destContentsNoGit = destContents.filter(t => t !== ".git" && t !== ".gitignore");

    if (destContentsNoGit.length) {
      throw new Error("Destination folder already exists and is not empty");
    }
  }

  await mkdir(destPath, { recursive: true });

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
