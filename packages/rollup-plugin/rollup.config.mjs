import typescript from "@rollup/plugin-typescript";
import { builtinModules } from "node:module";

export default {
  input: "src/index.ts",
  external: [
    ...builtinModules,
    "rollup",
    "node:path",
    "@rollup/plugin-replace",
    "@rollup/plugin-terser",
    "rollup-plugin-visualizer"
  ],
  output: [
    { file: "dist/index.js", format: "esm" },
    { file: "dist/index.cjs", format: "cjs" }
  ],
  plugins: [typescript()]
};