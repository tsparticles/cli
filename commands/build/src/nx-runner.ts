/* eslint-disable sort-imports */
/* eslint-disable jsdoc/require-jsdoc */
import type { BuildExecutionOptions } from "./build-options.js";
import { hasNxTaskContext, resolveNxContext, runNxTarget } from "./nx-context.js";
import { createNxTargetPlan } from "./nx-plan.js";

const emptyCount = 0;

export function tryRunNxBuild(options: BuildExecutionOptions): boolean {
  if (hasNxTaskContext()) {
    if (options.useNx && !options.silent) {
      console.warn("Skipping Nx delegation inside an active Nx task context, using legacy build flow.");
    }

    return false;
  }

  const nxContext = resolveNxContext(options.basePath);

  if (!nxContext) {
    if (options.useNx && !options.silent) {
      console.warn("Nx workspace context not found for the current package, using legacy build flow.");
    }

    return false;
  }

  const targetPlan = createNxTargetPlan(nxContext.targets, options);

  if (targetPlan.missingSteps.length > emptyCount) {
    if (!options.silent) {
      console.warn(
        `Nx targets not found for: ${targetPlan.missingSteps.join(", ")}. Falling back to legacy build flow.`,
      );
    }

    return false;
  }

  if (targetPlan.targets.length === emptyCount) {
    if (!options.silent) {
      console.warn("No Nx targets selected for the requested build options. Falling back to legacy build flow.");
    }

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

  console.info("Build completed successfully!");

  return true;
}
