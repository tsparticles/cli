import fs from "fs-extra";
import klaw from "klaw";
import path from "path";
import prettier from "prettier";

/**
 * @param basePath -
 * @param srcPath -
 * @param ci -
 * @returns true if the prettify src process was successful
 */
export async function prettifySrc(basePath: string, srcPath: string, ci: boolean): Promise<boolean> {
    console.log("Prettier - started on src");

    let res: boolean;

    try {
        for await (const file of klaw(srcPath)) {
            if (file.stats.isDirectory()) {
                continue;
            }

            const contents = await fs.readFile(file.path, "utf8"),
                options = (await prettier.resolveConfig(basePath)) ?? {};

            options.printWidth = 120;
            options.endOfLine = "lf";
            options.parser = "typescript";
            options.tabWidth = 4;

            if (ci) {
                if (!(await prettier.check(contents, options))) {
                    throw new Error(`${file.path} is not formatted correctly`);
                }
            } else {
                const formatted = await prettier.format(contents, options);

                await fs.writeFile(file.path, formatted, "utf8");
            }
        }

        res = true;
    } catch (e) {
        console.error(e);

        res = false;
    }

    console.log("Prettier - done on src");

    return res;
}

/**
 * @param basePath -
 * @param ci -
 * @returns true if the prettify readme process was successful
 */
export async function prettifyReadme(basePath: string, ci: boolean): Promise<boolean> {
    console.log("Prettier - started on README.md");

    let res: boolean;

    try {
        const contents = await fs.readFile("README.md", "utf8"),
            options = (await prettier.resolveConfig(basePath)) ?? {};

        options.printWidth = 120;
        options.endOfLine = "lf";
        options.parser = "markdown";

        if (ci) {
            if (!(await prettier.check(contents, options))) {
                throw new Error(`README.md is not formatted correctly`);
            }
        } else {
            const formatted = await prettier.format(contents, options);

            await fs.writeFile("README.md", formatted, "utf8");
        }

        res = (await prettifyTraductions(basePath, ci)) && (await prettifyMarkdownTypeDocFiles(basePath, ci));
    } catch (e) {
        console.error(e);

        res = false;
    }

    console.log("Prettier - done on README.md");

    return res;
}

/**
 * @param basePath -
 * @param ci -
 * @returns true if the prettify traductions process was successful
 */
async function prettifyTraductions(basePath: string, ci: boolean): Promise<boolean> {
    console.log("Prettier - started on traductions");

    let res = false;

    try {
        const folder = "traduction",
            folderPath = path.join(basePath, folder);

        if (!fs.existsSync(folderPath)) {
            res = true;
        }

        if (!res) {
            for await (const file of klaw(folderPath)) {
                if (file.stats.isDirectory()) {
                    continue;
                }

                const contents = await fs.readFile(file.path, "utf8"),
                    options = (await prettier.resolveConfig(basePath)) ?? {};

                options.printWidth = 120;
                options.endOfLine = "lf";
                options.parser = "markdown";

                if (ci) {
                    if (!(await prettier.check(contents, options))) {
                        throw new Error(`${file.path} is not formatted correctly`);
                    }
                } else {
                    const formatted = await prettier.format(contents, options);

                    await fs.writeFile(file.path, formatted, "utf8");
                }
            }

            res = true;
        }
    } catch (e) {
        console.error(e);

        res = false;
    }

    console.log("Prettier - done on traductions");

    return res;
}

/**
 * @param basePath -
 * @param ci -
 * @returns true if the prettify markdown typedoc files process was successful
 */
async function prettifyMarkdownTypeDocFiles(basePath: string, ci: boolean): Promise<boolean> {
    console.log("Prettier - started on markdown");

    let res = false;

    try {
        const folder = "markdown",
            folderPath = path.join(basePath, folder);

        if (!fs.existsSync(folderPath)) {
            res = true;
        }

        if (!res) {
            for await (const file of klaw(folderPath)) {
                if (file.stats.isDirectory()) {
                    continue;
                }

                const contents = await fs.readFile(file.path, "utf8"),
                    options = (await prettier.resolveConfig(basePath)) ?? {};

                options.printWidth = 120;
                options.endOfLine = "lf";
                options.parser = "markdown";

                if (ci) {
                    if (!(await prettier.check(contents, options))) {
                        throw new Error(`${file.path} is not formatted correctly`);
                    }
                } else {
                    const formatted = await prettier.format(contents, options);

                    await fs.writeFile(file.path, formatted, "utf8");
                }
            }

            res = true;
        }
    } catch (e) {
        console.error(e);

        res = false;
    }

    console.log("Prettier - done on markdown");

    return res;
}
