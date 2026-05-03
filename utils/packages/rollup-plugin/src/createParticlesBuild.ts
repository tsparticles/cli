import { buildMap, type ParticlesBuildType } from "./buildMap";
import { createConfig } from "./config/createConfig";
import type { ParticlesBuildParams } from "./types";

export const createParticlesBuild = (
  type: ParticlesBuildType,
  params: ParticlesBuildParams
) => {
  const def = buildMap[type];

  if (!def) {
    throw new Error(`Unknown build type: ${type}`);
  }

  const dir = params.dir,
    version = params.version,
    additionalExternals = params.additionalExternals,
    moduleName = params.moduleName,
    bundle = params.bundle,
    banner = def.banner(params),
    minBanner = def.minBanner(params),
    base = createConfig({
      entry: {
        format: def.format,
        name: moduleName,
        bundle: false,
      },
      version,
      banner,
      minBanner,
      dir,
      bundle: false,
      additionalExternals,
    });

  if (def.hasBundle && (bundle ?? true)) {
    return [
      ...base,
      ...createConfig({
        entry: {
          format: def.format,
          name: moduleName
            ? `${moduleName}.bundle`
            : "bundle",
          bundle: true,
        },
        version,
        banner,
        minBanner,
        dir,
        bundle: true,
        additionalExternals,
      }),
    ];
  }

  return base;
};
