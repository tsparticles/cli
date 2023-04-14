import path from "path";
import webpack from "webpack";

/**
 *
 * @param basePath -
 */
export async function bundle(basePath: string): Promise<boolean> {
    console.log("Bundling started");

    let res = false;

    try {
        const options = await import(path.join(basePath, "webpack.config.js"));

        res = await new Promise<boolean>((resolve, reject) => {
            webpack(options.default, (err, stats) => {
                if (err) {
                    console.error(err.stack || err);

                    reject(err);

                    return;
                }

                if (!stats) {
                    const err = "No stats returned from webpack";

                    console.error(err);

                    reject(err);

                    return;
                }

                const info = stats.toJson();

                if (stats.hasErrors()) {
                    console.error(info.errors);

                    reject(info.errors);
                }

                if (stats.hasWarnings()) {
                    console.warn(info.warnings);
                }

                resolve(true);
            });
        });
    } catch (e) {
        console.error(e);

        res = false;
    }

    console.log("Bundling done");

    return res;
}
