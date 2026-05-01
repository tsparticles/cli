/* eslint-disable sort-imports */
/* eslint-disable jsdoc/require-jsdoc */
import type { BuildExecutionOptions } from "./build-options.js";
import { hasNxTaskContext, resolveNxContext, runNxTarget } from "./nx-context.js";
import { createNxTargetPlan } from "./nx-plan.js";

const emptyCount = 0;

export function tryRunNxBuild(options: BuildExecutionOptions): boolean {
  if (options.legacy || hasNxTaskContext()) {
    return false;
  }

  const nxContext = resolveNxContext(options.basePath);

  if (!nxContext || (!options.useNx && !options.all)) {
    return false;
  }

  const targetPlan = createNxTargetPlan(nxContext.targets, options);

  if (targetPlan.missingSteps.length > emptyCount && options.useNx) {
    throw new Error(`Nx targets not found for: ${targetPlan.missingSteps.join(", ")}`);
  }

  if (targetPlan.targets.length === emptyCount || targetPlan.missingSteps.length > emptyCount) {
    return false;
  }

  if (!options.silent) {
    console.info(`Running Nx targets for project ${nxContext.projectName}: ${targetPlan.targets.join(", ")}`);
  }

  for (const target of targetPlan.targets) {
    if (
      !runNxTarget(nxContext.workspaceRoot, nxContext.packageManager, nxContext.projectName, target, options.silent)
    ) {
      throw new Error(`Nx target failed: ${nxContext.projectName}:${target}`);
    }
  }

  console.log("Build finished successfully!");

  return true;
}
