import { ESLint } from "eslint";

/**
 * @param ci -
 * @returns true if the linting was successful
 */
export async function lint(ci: boolean): Promise<boolean> {
    console.log("ESLint - started on src");

    let res: boolean;

    try {
        const eslint = new ESLint({
            baseConfig: {
                extends: ["@tsparticles/eslint-config"],
            },
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            fix: !ci,
        });

        const results = await eslint.lintFiles(["src"]),
            errors = ESLint.getErrorResults(results);

        await ESLint.outputFixes(results);

        const formatter = await eslint.loadFormatter("stylish"),
            resultText = formatter.format(results),
            minimumLength = 0;

        if (errors.length > minimumLength) {
            const messages = errors.map(t =>
                t.messages.map(m => `${t.filePath} (${m.line},${m.column}): ${m.message}`).join("\n"),
            );

            throw new Error(messages.join("\n"));
        }

        console.log(resultText);

        res = true;
    } catch (e) {
        console.error(e);

        res = false;
    }

    console.log("ESLint - done on src");

    return res;
}
