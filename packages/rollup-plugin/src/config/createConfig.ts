import type { ConfigParams } from "../types";
import type { RollupOptions } from "rollup";
import { createSingleConfig } from "./createSingleConfig";

export const createConfig = (params: ConfigParams): RollupOptions[] => {
  return [
    createSingleConfig(params, false, false),
    createSingleConfig(params, true, false),
    createSingleConfig(params, false, true),
    createSingleConfig(params, true, true),
  ];
};
