import type { ExternalData } from "../types";

interface Params {
  additionalExternals?: ExternalData[];
  bundle?: boolean;
}

export const getExternal = ({ bundle, additionalExternals = [] }: Params) => {
  if (bundle) {
    return [];
  }

  return [
    ...additionalExternals.map(e => e.name),
    /^tsparticles$/,
    /^tsparticles-/,
    /^@tsparticles\//,
  ];
};

export const getGlobals = (
  additionalExternals: ExternalData[] = [],
  bundle?: boolean
) => {
  if (bundle) {
    return {};
  }

  return Object.fromEntries(
    additionalExternals.map(e => [e.name, "window"])
  );
};
