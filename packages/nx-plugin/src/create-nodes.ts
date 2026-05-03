import { type CreateNodesV2, createNodesFromFiles, readJsonFile } from "@nx/devkit";
import { createCanonicalAliasTargets, isTsParticlesWorkspacePackage } from "./canonical-targets.ts";
import { dirname, join } from "node:path";

interface TsParticlesPackageJson {
  scripts?: Record<string, string>;
}

const emptyCount = 0;

/**
 * @param packageJsonPath -
 * @param workspaceRoot -
 * @returns -
 */
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
