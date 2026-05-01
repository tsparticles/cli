/* eslint-disable sort-imports */
/* eslint-disable jsdoc/require-jsdoc */
import { createNodesFromFiles, readJsonFile, type CreateNodesV2 } from "@nx/devkit";
import { dirname, join } from "node:path";

import { createCanonicalAliasTargets, isTsParticlesWorkspacePackage } from "./canonical-targets.ts";

interface TsParticlesPackageJson {
  scripts?: Record<string, string>;
}

const emptyCount = 0;

function createProjectAugmentation(packageJsonPath: string, workspaceRoot: string): Record<string, unknown> {
  if (!isTsParticlesWorkspacePackage(packageJsonPath)) {
    return {};
  }

  const packageJson = readJsonFile<TsParticlesPackageJson>(join(workspaceRoot, packageJsonPath)),
    aliasTargets = createCanonicalAliasTargets(packageJson.scripts),
    targetNames = Object.keys(aliasTargets);

  if (targetNames.length === emptyCount) {
    return {};
  }

  const projectRoot = dirname(packageJsonPath);

  return {
    projects: {
      [projectRoot]: {
        root: projectRoot,
        targets: aliasTargets,
        metadata: {
          targetGroups: {
            "tsParticles Nx aliases": targetNames,
          },
        },
      },
    },
  };
}

export const createNodesV2: CreateNodesV2 = [
  "**/package.json",
  (configFiles, options, context): ReturnType<typeof createNodesFromFiles> =>
    createNodesFromFiles(
      packageJsonPath => createProjectAugmentation(packageJsonPath, context.workspaceRoot),
      configFiles,
      options,
      context,
    ),
];
