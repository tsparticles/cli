/* eslint-disable jsdoc/require-jsdoc */
export interface NxTargetConventions {
  aggregate: {
    ci: readonly string[];
    default: readonly string[];
  };
  bundle: readonly string[];
  bundleRollup: readonly string[];
  circularDeps: readonly string[];
  clean: readonly string[];
  distfiles: readonly string[];
  lint: {
    ci: readonly string[];
    default: readonly string[];
  };
  prettifyReadme: {
    ci: readonly string[];
    default: readonly string[];
  };
  prettifySource: {
    ci: readonly string[];
    default: readonly string[];
  };
  tsc: {
    ci: readonly string[];
    default: readonly string[];
  };
}

export const nxTargetConventions: NxTargetConventions = {
  aggregate: {
    ci: ["build:ci", "build-ci"],
    default: ["build"],
  },
  bundle: ["bundle:webpack", "build:bundle:webpack"],
  bundleRollup: ["bundle:rollup", "build:bundle:rollup"],
  clean: ["clean", "clear:dist"],
  circularDeps: ["circular-deps"],
  distfiles: ["distfiles", "build:distfiles"],
  lint: {
    ci: ["lint:ci"],
    default: ["lint"],
  },
  prettifyReadme: {
    ci: ["prettify:ci:readme"],
    default: ["prettify:readme"],
  },
  prettifySource: {
    ci: ["prettify:ci", "prettify:ci:src"],
    default: ["prettify", "prettify:src", "format"],
  },
  tsc: {
    ci: ["tsc", "compile:ci", "typecheck:ci", "build:ts"],
    default: ["tsc", "compile", "build:ts", "typecheck"],
  },
};

export const nxCanonicalTargets = [
  "build",
  "build:ci",
  "clean",
  "prettify",
  "prettify:ci",
  "prettify:readme",
  "prettify:ci:readme",
  "lint",
  "lint:ci",
  "tsc",
  "circular-deps",
  "bundle:webpack",
  "bundle:rollup",
  "distfiles",
] as const;

export function pickTarget(targets: Set<string>, candidates: readonly string[]): string | undefined {
  return candidates.find(candidate => targets.has(candidate));
}
