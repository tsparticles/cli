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
