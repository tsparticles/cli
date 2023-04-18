import path from "path";
import { rimraf } from "rimraf";

/**
 * @param basePath -
 * @returns true if the dist folder was cleared
 */
export async function clearDist(basePath: string): Promise<boolean> {
    console.log("Clearing dist folder");

    let res = false;

    try {
        await rimraf(path.join(basePath, "dist"));

        res = true;
    } catch (e) {
        console.error(e);

        res = false;
    }

    console.log("Clearing dist folder done");

    return res;
}
