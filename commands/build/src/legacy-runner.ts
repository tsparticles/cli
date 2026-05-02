/* eslint-disable sort-imports */
/* eslint-disable jsdoc/require-jsdoc */
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";

import type { BuildExecutionOptions } from "./build-options.js";
import { nxTargetConventions } from "./nx-targets.js";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

interface PackageJsonWithScripts {
  packageManager?: string;
  scripts?: Record<string, string>;
}

const successExitCode = 0,
  emptyCount = 0;

function resolvePackageManager(value?: string): PackageManager {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized.startsWith("pnpm")) {
    return "pnpm";
  }

  if (normalized.startsWith("npm")) {
    return "npm";
  }

  if (normalized.startsWith("yarn")) {
    return "yarn";
  }

  if (normalized.startsWith("bun")) {
    return "bun";
  }

  return "pnpm";
}

function runScript(basePath: string, packageManager: PackageManager, scriptName: string, silent: boolean): boolean {
  let command: { args: string[]; executable: string };

  switch (packageManager) {
    case "npm":
      command = { args: ["run", scriptName], executable: "npm" };
      break;
    case "yarn":
      command = { args: ["run", scriptName], executable: "yarn" };
      break;
    case "bun":
      command = { args: ["run", scriptName], executable: "bun" };
      break;
    default:
      command = { args: ["run", scriptName], executable: "pnpm" };
      break;
  }

  const result = spawnSync(command.executable, command.args, {
    cwd: basePath,
    stdio: silent ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
  });

  if (result.status === successExitCode) {
    return true;
  }

  if (silent) {
    if (result.stderr) {
      console.error(result.stderr.trim());
    }

    if (result.stdout) {
      console.error(result.stdout.trim());
    }
  }

  return false;
}

function findScript(scripts: Record<string, string>, candidates: readonly string[]): string | undefined {
  return candidates.find(candidate => !!scripts[candidate]);
}

function addScriptStep(
  selectedScripts: string[],
  missingSteps: string[],
  scripts: Record<string, string>,
  candidates: readonly string[],
  missingStep: string,
  optional = false,
): void {
  const scriptName = findScript(scripts, candidates);

  if (scriptName) {
    selectedScripts.push(scriptName);

    return;
  }

  if (!optional) {
    missingSteps.push(missingStep);
  }
}

export function runLegacyBuild(options: BuildExecutionOptions): void {
  const packageJsonPath = path.join(options.basePath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found in ${options.basePath}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as PackageJsonWithScripts,
    scripts = packageJson.scripts;

  if (!scripts) {
    throw new Error("No scripts found in package.json for legacy build execution.");
  }

  if (options.all) {
    const aggregateScript = findScript(
      scripts,
      options.ci ? nxTargetConventions.aggregate.ci : nxTargetConventions.aggregate.default,
    );

    if (aggregateScript) {
      if (
        !runScript(options.basePath, resolvePackageManager(packageJson.packageManager), aggregateScript, options.silent)
      ) {
        throw new Error(`Legacy build script failed: ${aggregateScript}`);
      }

      console.info("Build completed successfully!");

      return;
    }
  }

  const selectedScripts: string[] = [],
    missingSteps: string[] = [];

  if (options.clean) {
    addScriptStep(selectedScripts, missingSteps, scripts, nxTargetConventions.clean, "clean");
  }

  if (options.prettier) {
    addScriptStep(
      selectedScripts,
      missingSteps,
      scripts,
      options.ci ? nxTargetConventions.prettifySource.ci : nxTargetConventions.prettifySource.default,
      "prettify",
    );
  }

  if (options.doLint) {
    addScriptStep(
      selectedScripts,
      missingSteps,
      scripts,
      options.ci ? nxTargetConventions.lint.ci : nxTargetConventions.lint.default,
      "lint",
    );
  }

  if (options.tsc) {
    addScriptStep(
      selectedScripts,
      missingSteps,
      scripts,
      options.ci ? nxTargetConventions.tsc.ci : nxTargetConventions.tsc.default,
      "tsc",
    );
  }

  if (options.circularDeps) {
    addScriptStep(selectedScripts, missingSteps, scripts, nxTargetConventions.circularDeps, "circular-deps");
  }

  if (options.doBundleWebpack) {
    addScriptStep(selectedScripts, missingSteps, scripts, nxTargetConventions.bundle, "bundle:webpack");
  }

  if (options.doBundleRollup) {
    addScriptStep(selectedScripts, missingSteps, scripts, nxTargetConventions.bundleRollup, "bundle:rollup");
  }

  if (options.prettier) {
    addScriptStep(
      selectedScripts,
      missingSteps,
      scripts,
      options.ci ? nxTargetConventions.prettifyReadme.ci : nxTargetConventions.prettifyReadme.default,
      "prettify-readme",
      true,
    );
  }

  if (options.distfiles) {
    addScriptStep(selectedScripts, missingSteps, scripts, nxTargetConventions.distfiles, "distfiles");
  }

  if (missingSteps.length > emptyCount) {
    throw new Error(`Missing package scripts for: ${missingSteps.join(", ")}`);
  }

  const scriptsToRun = [...new Set(selectedScripts)];

  if (scriptsToRun.length === emptyCount) {
    throw new Error("No legacy build scripts selected for the requested options.");
  }

  const packageManager = resolvePackageManager(packageJson.packageManager);

  for (const scriptName of scriptsToRun) {
    if (!runScript(options.basePath, packageManager, scriptName, options.silent)) {
      throw new Error(`Legacy build script failed: ${scriptName}`);
    }
  }

  console.info("Build completed successfully!");
}
