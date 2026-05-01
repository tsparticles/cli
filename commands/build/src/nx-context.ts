/* eslint-disable sort-imports */
/* eslint-disable jsdoc/require-jsdoc */
import * as fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

import type { NxCommand, NxContext, PackageManager } from "./nx-types.js";

const nxTaskEnvVars = ["NX_TASK_TARGET_PROJECT", "NX_TASK_TARGET_TARGET", "NX_TASK_TARGET_CONFIGURATION"],
  successExitCode = 0;

function findNxWorkspaceRoot(startPath: string): string | undefined {
  let current = path.resolve(startPath);

  for (;;) {
    if (fs.existsSync(path.join(current, "nx.json"))) {
      return current;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      return undefined;
    }

    current = parent;
  }
}

function getPackageManager(workspaceRoot: string): PackageManager {
  try {
    const packageJsonPath = path.join(workspaceRoot, "package.json"),
      raw = fs.readFileSync(packageJsonPath, "utf8"),
      pkg = JSON.parse(raw) as { packageManager?: string },
      packageManager = pkg.packageManager?.toLowerCase() ?? "";

    if (packageManager.startsWith("pnpm")) {
      return "pnpm";
    }

    if (packageManager.startsWith("npm")) {
      return "npm";
    }

    if (packageManager.startsWith("yarn")) {
      return "yarn";
    }

    if (packageManager.startsWith("bun")) {
      return "bun";
    }
  } catch {
    // Fallback handled below.
  }

  return "npx";
}

function getNxCommand(packageManager: PackageManager, nxArgs: string[]): NxCommand {
  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["nx", ...nxArgs] };
    case "npm":
      return { command: "npm", args: ["exec", "nx", ...nxArgs] };
    case "yarn":
      return { command: "yarn", args: ["nx", ...nxArgs] };
    case "bun":
      return { command: "bunx", args: ["nx", ...nxArgs] };
    default:
      return { command: "npx", args: ["nx", ...nxArgs] };
  }
}

function runNxJsonCommand(workspaceRoot: string, packageManager: PackageManager, nxArgs: string[]): unknown {
  const { command, args } = getNxCommand(packageManager, nxArgs),
    result = spawnSync(command, args, {
      cwd: workspaceRoot,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });

  if (result.status !== successExitCode || !result.stdout) {
    return undefined;
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    return undefined;
  }
}

interface NxProjectDetails {
  root?: string;
  targets?: Record<string, unknown>;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function toNxProjectDetails(value: unknown): NxProjectDetails | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>,
    details: NxProjectDetails = {},
    root = record["root"],
    targets = record["targets"];

  if (typeof root === "string") {
    details.root = root;
  }

  if (targets && typeof targets === "object" && !Array.isArray(targets)) {
    details.targets = targets as Record<string, unknown>;
  }

  return details;
}

function resolveProjectNameFromPackageJson(basePath: string): string | undefined {
  try {
    const packageJsonPath = path.join(basePath, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
      return undefined;
    }

    const raw = fs.readFileSync(packageJsonPath, "utf8"),
      pkg = JSON.parse(raw) as { name?: string };

    return pkg.name;
  } catch {
    return undefined;
  }
}

export function resolveNxContext(basePath: string): NxContext | undefined {
  const workspaceRoot = findNxWorkspaceRoot(basePath);

  if (!workspaceRoot) {
    return undefined;
  }

  const packageManager = getPackageManager(workspaceRoot),
    projectsOutput = runNxJsonCommand(workspaceRoot, packageManager, ["show", "projects", "--json"]);

  if (!isStringArray(projectsOutput)) {
    return undefined;
  }

  const projects = projectsOutput,
    packageProjectName = resolveProjectNameFromPackageJson(basePath),
    candidateNames = packageProjectName ? [packageProjectName, path.basename(basePath)] : [path.basename(basePath)],
    dedupedCandidates = [...new Set(candidateNames)],
    absoluteBasePath = path.resolve(basePath);

  for (const candidateName of dedupedCandidates) {
    if (!projects.includes(candidateName)) {
      continue;
    }

    const projectDetails = toNxProjectDetails(
      runNxJsonCommand(workspaceRoot, packageManager, [
        "show",
        "project",
        candidateName,
        "--json",
      ]),
    );

    if (!projectDetails?.root || path.resolve(workspaceRoot, projectDetails.root) !== absoluteBasePath) {
      continue;
    }

    return {
      workspaceRoot,
      packageManager,
      projectName: candidateName,
      targets: new Set(Object.keys(projectDetails.targets ?? {})),
    };
  }

  const remainingProjectNames = projects.filter(projectName => !dedupedCandidates.includes(projectName));

  for (const projectName of remainingProjectNames) {
    const projectDetails = toNxProjectDetails(
      runNxJsonCommand(workspaceRoot, packageManager, [
        "show",
        "project",
        projectName,
        "--json",
      ]),
    );

    if (!projectDetails?.root || path.resolve(workspaceRoot, projectDetails.root) !== absoluteBasePath) {
      continue;
    }

    return {
      workspaceRoot,
      packageManager,
      projectName,
      targets: new Set(Object.keys(projectDetails.targets ?? {})),
    };
  }

  return undefined;
}

export function hasNxTaskContext(): boolean {
  return nxTaskEnvVars.some(variable => !!process.env[variable]);
}

export function runNxTarget(
  workspaceRoot: string,
  packageManager: PackageManager,
  projectName: string,
  target: string,
  silent: boolean,
): boolean {
  const { command, args } = getNxCommand(packageManager, ["run-many", "-p", projectName, "-t", target]),
    result = spawnSync(command, args, {
      cwd: workspaceRoot,
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
