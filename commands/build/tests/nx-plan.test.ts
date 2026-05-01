import { describe, expect, it } from "vitest";

import type { BuildExecutionOptions } from "../src/build-options.js";
import { createNxTargetPlan } from "../src/nx-plan.js";

function createOptions(overrides: Partial<BuildExecutionOptions> = {}): BuildExecutionOptions {
  return {
    all: false,
    argPath: "src",
    basePath: "/tmp/project",
    ci: false,
    circularDeps: false,
    clean: false,
    distfiles: false,
    doBundleRollup: false,
    doBundleWebpack: false,
    doLint: false,
    prettier: false,
    silent: false,
    tsc: false,
    useNx: false,
    ...overrides,
  };
}

describe("createNxTargetPlan", () => {
  it("prefers canonical Nx aliases when they are available", () => {
    const plan = createNxTargetPlan(
      new Set(["build", "clean", "prettify", "lint", "tsc", "circular-deps", "bundle:webpack", "distfiles"]),
      createOptions({
        clean: true,
        prettier: true,
        doLint: true,
        tsc: true,
        circularDeps: true,
        doBundleWebpack: true,
        distfiles: true,
      }),
    );

    expect(plan.missingSteps).toEqual([]);
    expect(plan.targets).toEqual(["clean", "prettify", "lint", "tsc", "circular-deps", "bundle:webpack", "distfiles"]);
  });

  it("falls back to legacy script-style targets when the plugin aliases are missing", () => {
    const plan = createNxTargetPlan(
      new Set(["clear:dist", "prettify:src", "lint", "compile", "circular-deps", "prettify:readme"]),
      createOptions({ clean: true, prettier: true, doLint: true, tsc: true, circularDeps: true }),
    );

    expect(plan.missingSteps).toEqual([]);
    expect(plan.targets).toEqual(["clear:dist", "prettify:src", "lint", "compile", "circular-deps", "prettify:readme"]);
  });

  it("selects rollup bundle target when requested", () => {
    const plan = createNxTargetPlan(
      new Set(["bundle:rollup", "build:bundle:rollup"]),
      createOptions({ doBundleRollup: true }),
    );

    expect(plan.missingSteps).toEqual([]);
    expect(plan.targets).toEqual(["bundle:rollup"]);
  });

  it("prefers webpack-specific bundle target when available", () => {
    const plan = createNxTargetPlan(
      new Set(["bundle:webpack", "build:bundle:webpack"]),
      createOptions({ doBundleWebpack: true }),
    );

    expect(plan.missingSteps).toEqual([]);
    expect(plan.targets).toEqual(["bundle:webpack"]);
  });

  it("uses the aggregate build target when available for all-mode", () => {
    const plan = createNxTargetPlan(new Set(["build:ci", "lint", "tsc"]), createOptions({ all: true, ci: true }));

    expect(plan).toEqual({
      missingSteps: [],
      targets: ["build:ci"],
    });
  });

  it("reports missing mandatory targets when partial Nx execution is incomplete", () => {
    const plan = createNxTargetPlan(new Set(["lint"]), createOptions({ clean: true, doLint: true, tsc: true }));

    expect(plan.missingSteps).toEqual(["clean", "tsc"]);
    expect(plan.targets).toEqual(["lint"]);
  });
});

