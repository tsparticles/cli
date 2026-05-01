/* eslint-disable sort-imports */
/* eslint-disable jsdoc/require-jsdoc */
import type { BuildExecutionOptions } from "./build-options.js";
import { nxTargetConventions, pickTarget } from "./nx-targets.js";
import type { NxTargetPlan } from "./nx-types.js";

interface TargetPlanStep {
  candidates: readonly string[];
  missingStep: string;
  optional?: boolean;
}

function appendTarget(
  selectedTargets: string[],
  missingSteps: string[],
  availableTargets: Set<string>,
  step: TargetPlanStep,
): void {
  const target = pickTarget(availableTargets, step.candidates);

  if (target) {
    selectedTargets.push(target);

    return;
  }

  if (!step.optional) {
    missingSteps.push(step.missingStep);
  }
}

export function createNxTargetPlan(targets: Set<string>, options: BuildExecutionOptions): NxTargetPlan {
  const selectedTargets: string[] = [],
    missingSteps: string[] = [];

  if (options.all) {
    const aggregateTarget = pickTarget(
      targets,
      options.ci ? nxTargetConventions.aggregate.ci : nxTargetConventions.aggregate.default,
    );

    if (aggregateTarget) {
      return { targets: [aggregateTarget], missingSteps: [] };
    }
  }

  const steps: (TargetPlanStep | false)[] = [
    options.clean && { candidates: nxTargetConventions.clean, missingStep: "clean" },
    options.prettier && {
      candidates: options.ci ? nxTargetConventions.prettifySource.ci : nxTargetConventions.prettifySource.default,
      missingStep: "prettify",
    },
    options.doLint && {
      candidates: options.ci ? nxTargetConventions.lint.ci : nxTargetConventions.lint.default,
      missingStep: "lint",
    },
    options.tsc && {
      candidates: options.ci ? nxTargetConventions.tsc.ci : nxTargetConventions.tsc.default,
      missingStep: "tsc",
    },
    options.circularDeps && { candidates: nxTargetConventions.circularDeps, missingStep: "circular-deps" },
    options.doBundleWebpack && { candidates: nxTargetConventions.bundle, missingStep: "bundle" },
    options.doBundleRollup && { candidates: nxTargetConventions.bundleRollup, missingStep: "bundle:rollup" },
    options.prettier && {
      candidates: options.ci ? nxTargetConventions.prettifyReadme.ci : nxTargetConventions.prettifyReadme.default,
      missingStep: "prettify-readme",
      optional: true,
    },
    options.distfiles && { candidates: nxTargetConventions.distfiles, missingStep: "distfiles" },
  ];

  for (const step of steps) {
    if (!step) {
      continue;
    }

    appendTarget(selectedTargets, missingSteps, targets, step);
  }

  return {
    targets: [...new Set(selectedTargets)],
    missingSteps,
  };
}
