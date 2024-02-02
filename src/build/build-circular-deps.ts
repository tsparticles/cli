import madge from "madge";
import path from "path";

/**
 *
 * @param basePath -
 * @returns true if no circular dependencies are found, false otherwise
 */
export async function buildCircularDeps(basePath: string): Promise<boolean> {
    let res = false;

    try {
        const madgeRes = await madge(path.join(basePath, "src"), {
                fileExtensions: ["ts"],
                detectiveOptions: {
                    skipTypeImports: true,
                },
            }),
            circularDeps = madgeRes.circular();

        if (circularDeps.length) {
            throw new Error(`Circular dependencies found: ${circularDeps.join(", ")}`);
        }

        res = true;
    } catch (e) {
        console.error(e);
    }

    console.log("Finished checking circular dependencies.");

    return res;
}
