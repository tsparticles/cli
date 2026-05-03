export interface ExternalData {
  bundle: boolean;
  data: Record<string, unknown>;
  name: string;
}

export interface ConfigParams {
  additionalExternals?: ExternalData[];
  banner: string;
  bundle?: boolean;
  dir: string;
  entry: {
    bundle: boolean;
    format: string;
    name?: string;
  };
  minBanner: string;
  version: string;
}

export interface ParticlesBuildParams {
  dir: string;
  version: string;
  additionalExternals?: ExternalData[];
  moduleName?: string;
  bundle?: boolean;
  bundleName?: string;
  effectName?: string;
  pluginName?: string;
  presetName?: string;
  shapeName?: string;
  templateName?: string;
  updaterName?: string;
  [key: string]: unknown;
}
