import { Command } from "commander";
import { lint } from "./utils.js";

const esLintCommand = new Command("eslint");

esLintCommand.description("ESLint for tsParticles library");
esLintCommand.option(
  "--ci",
  "Do all build steps for CI, no fixing files, only checking if they are formatted correctly, sets silent to true by default",
  false,
);
esLintCommand.option(
  "-s, --silent <boolean>",
  "Reduce the amount of output during the build, defaults to false, except when --ci is set",
  false,
);

esLintCommand.action(async () => {
  const opts = esLintCommand.opts(),
    ci = !!opts["ci"],
    silentOpt = opts["silent"] as string | boolean,
    silent = silentOpt === "false" ? false : !!silentOpt || ci;

  if (!(await lint(ci, silent))) {
    throw new Error("Dist files build failed");
  }

  console.log("Bundle finished successfully!");
});

export { lint, esLintCommand };
