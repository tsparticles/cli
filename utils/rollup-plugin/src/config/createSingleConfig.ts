import path from "node:path";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import { getEntry } from "./entry";
import { getExternal, getGlobals } from "./externals";
import type { ConfigParams } from "../types";
import type { RollupOptions } from "rollup";

export const createSingleConfig = (
  params: ConfigParams,
  min: boolean,
  lazy: boolean
): RollupOptions => {
  const {
      additionalExternals,
      banner,
      bundle,
      dir,
      entry,
      minBanner,
      version,
    } = params,
    { name, input } = getEntry({ ...entry, min, lazy });

  return {
    input,
    external: getExternal({ bundle, additionalExternals }),
    plugins: [
      replace({
        preventAssignment: true,
        __VERSION__: JSON.stringify(version),
      }),
      !min &&
      visualizer({
        filename: path.resolve(dir, "dist/report.html"),
      }),
      min && terser(),
    ].filter(Boolean),
    output: {
      file: path.resolve(dir, "dist", `${name}.js`),
      format: "umd",
      name: "tsParticles",
      globals: getGlobals(additionalExternals, bundle),
      banner: min ? minBanner : banner,
      inlineDynamicImports: true,
    },
  };
};
