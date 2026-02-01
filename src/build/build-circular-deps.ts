import {
  type ICruiseOptions,
  type ICruiseResult,
  type IForbiddenRuleType,
  type IViolation,
  cruise,
} from "dependency-cruiser";
import fs from "fs-extra";
import path from "node:path";

const ZERO_VIOLATIONS = 0;

/**
 * Checks for circular dependencies using dependency-cruiser
 * @param basePath - The project root path
 * @returns true if no circular dependencies are found, false otherwise
 */
export async function buildCircularDeps(basePath: string): Promise<boolean> {
  const srcPath = path.join(basePath, "src"),
    configPath = path.join(basePath, ".dependency-cruiser.js"),
    configPathCjs = path.join(basePath, ".dependency-cruiser.cjs");

  // Base options with explicit type
  let cruiseOptions: ICruiseOptions = {
    tsPreCompilationDeps: false,
    tsConfig: {
      fileName: path.join(basePath, "tsconfig.json"),
    },
  };

  try {
    if (await fs.pathExists(configPath)) {
      const configModule = (await import(configPath)) as {
          default: {
            forbidden?: IForbiddenRuleType[];
            options?: ICruiseOptions;
          };
        },
        extendedConfig = configModule.default;

      cruiseOptions = {
        ...cruiseOptions,
        ...extendedConfig.options,
        ruleSet: {
          forbidden: extendedConfig.forbidden ?? [],
        },
      };
    } else if (await fs.pathExists(configPathCjs)) {
      const configModule = (await import(configPathCjs)) as {
          default: {
            forbidden?: IForbiddenRuleType[];
            options?: ICruiseOptions;
          };
        },
        extendedConfig = configModule.default;

      cruiseOptions = {
        ...cruiseOptions,
        ...extendedConfig.options,
        ruleSet: {
          forbidden: extendedConfig.forbidden ?? [],
        },
      };
    } else {
      console.log("No .dependency-cruiser.js found, applying default circular check.");

      cruiseOptions.ruleSet = {
        forbidden: [
          {
            name: "no-circular",
            severity: "error",
            from: {},
            to: { circular: true },
          },
        ],
      };
    }

    const result: unknown = await cruise([srcPath], cruiseOptions),
      cruiseResult = result as Partial<ICruiseResult>,
      violations: IViolation[] = cruiseResult.summary?.violations ?? [],
      circularViolations = violations.filter((violation: IViolation) => violation.rule.name === "no-circular");

    if (circularViolations.length > ZERO_VIOLATIONS) {
      console.error("⚠️ Circular dependencies found!");

      for (const violation of circularViolations) {
        const cyclePath = (violation.cycle ?? []).map(step => {
          return (step as { name: string }).name;
        });

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
