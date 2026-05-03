export type PackageManager = "pnpm" | "npm" | "yarn" | "bun" | "npx";

export interface NxCommand {
  args: string[];
  command: string;
}

export interface NxContext {
  packageManager: PackageManager;
  projectName: string;
  targets: Set<string>;
  workspaceRoot: string;
}

export interface NxTargetPlan {
  missingSteps: string[];
  targets: string[];
}
