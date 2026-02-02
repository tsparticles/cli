import { type ICruiseResult, type IViolation, cruise } from "dependency-cruiser";
import { loadDependencyCruiserConfig } from "@tsparticles/depcruise-config";
import path from "node:path";

const ZERO_VIOLATIONS = 0;

/**
 * Checks for circular dependencies using dependency-cruiser
 * @param basePath - The project root path
 * @returns true if no circular dependencies are found, false otherwise
 */
export async function buildCircularDeps(basePath: string): Promise<boolean> {
  const srcPath = path.join(basePath, "src"),
    cruiseOptions = await loadDependencyCruiserConfig(basePath);

  try {
    const result = await cruise([srcPath], {
        ...cruiseOptions.options,
        ruleSet: {
          forbidden: cruiseOptions.forbidden ?? [],
        },
      }),
      cruiseResult = result as Partial<ICruiseResult>,
      violations: IViolation[] = cruiseResult.summary?.violations ?? [],
      circularViolations = violations.filter(violation => violation.rule.name === "no-circular");

    if (circularViolations.length > ZERO_VIOLATIONS) {
      console.error("⚠️ Circular dependencies found!");

      for (const violation of circularViolations) {
        const cyclePath = (violation.cycle ?? []).map(step => (step as { name: string }).name);

        console.error(`Cycle detected: ${cyclePath.join(" -> ")}`);
      }
      return false;
    }

    console.log("✅ No circular dependencies found.");

    return true;
  } catch (e) {
    console.error("❌ Error while checking dependencies:", e);

    return false;
  } finally {
    console.log("Finished checking circular dependencies.");
  }
}
