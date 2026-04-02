import { existsSync } from "node:fs";
import path from "node:path";
import { readFile } from "node:fs/promises";

enum ExitCodes {
  OK = 0,
  EmitErrors = 1,
  NoDataOrOptions = 2,
  NoOptions = 3,
  ParseError = 4,
}

/**
 * @param basePath -
 * @param file -
 * @returns the file content or undefined if the file doesn't exist
 */
async function readConfig(basePath: string, file: string): Promise<string | undefined> {
  const tsconfigPath = path.join(basePath, file);

  if (existsSync(tsconfigPath)) {
    const data = await readFile(path.join(basePath, file));

    return data.toString();
  }

  return undefined;
}

/**
 * @param basePath -
 * @param type -
 * @param silent -
 * @returns the exit code
 */
async function compile(basePath: string, type: "browser" | "cjs" | "esm" | "types", silent: boolean): Promise<number> {
  let options: unknown, data: string | undefined;

  switch (type) {
    case "browser":
      data = await readConfig(basePath, "tsconfig.browser.json");

      if (!data) {
        options = {
          extends: "@tsparticles/tsconfig/dist/tsconfig.browser.json",
          compilerOptions: {
            rootDir: "./src",
            outDir: "./dist/browser",
          },
          include: ["./src"],
        };
      }

      break;
    case "cjs":
      data = await readConfig(basePath, "tsconfig.json");

      if (!data) {
        options = {
          extends: "@tsparticles/tsconfig/dist/tsconfig.json",
          compilerOptions: {
            rootDir: "./src",
            outDir: "./dist/cjs",
          },
          include: ["./src"],
        };
      }

      break;
    case "esm":
      data = await readConfig(basePath, "tsconfig.module.json");

      if (!data) {
        options = {
          extends: "@tsparticles/tsconfig/dist/tsconfig.module.json",
          compilerOptions: {
            rootDir: "./src",
            outDir: "./dist/esm",
          },
          include: ["./src"],
        };
      }

      break;
    case "types":
      data = await readConfig(basePath, "tsconfig.types.json");

      if (!data) {
        options = {
          extends: "@tsparticles/tsconfig/dist/tsconfig.types.json",
          compilerOptions: {
            rootDir: "./src",
            outDir: "./dist/types",
          },
          include: ["./src"],
        };
      }

      break;
  }

  if (!data && !options) {
    return ExitCodes.NoDataOrOptions;
  }

  if (!options && data) {
    options = JSON.parse(data);
  }

  if (!options) {
    return ExitCodes.NoOptions;
  }

  const ts = await import("typescript"),
    parsed = ts.parseJsonConfigFileContent(options, ts.sys, basePath);

  if (parsed.errors.length) {
    return ExitCodes.ParseError;
  }

  const program = ts.createProgram(parsed.fileNames, parsed.options),
    emitResult = program.emit(),
    allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  let failed = false;

  for (const diagnostic of allDiagnostics) {
    failed = failed || diagnostic.category === ts.DiagnosticCategory.Error;

    if (diagnostic.file) {
      const startingPos = 0,
        { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start ?? startingPos),
        message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        increment = 1;

      console.log(
        `${diagnostic.file.fileName} (${(line + increment).toString()},${(character + increment).toString()}): ${message}`,
      );
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  }

  const exitCode = emitResult.emitSkipped || failed ? ExitCodes.EmitErrors : ExitCodes.OK;

  if (!silent || exitCode) {
    console.log(`TSC for ${type} done with exit code: '${exitCode.toLocaleString()}'.`);
  }

  return exitCode;
}

/**
 * @param basePath -
 * @param silent -
 * @returns true if the build was successful
 */
export async function buildTS(basePath: string, silent: boolean): Promise<boolean> {
  if (!silent) {
    console.log("Building TS files");
  }

  let res = true;

  const types: ("browser" | "cjs" | "esm" | "types")[] = ["browser", "cjs", "esm", "types"];

  for (const type of types) {
    if (!silent) {
      console.log(`Building TS files for ${type} configuration`);
    }

    const exitCode = await compile(basePath, type, silent);

    if (exitCode) {
      res = false;

      break;
    }
  }

  if (!silent) {
    console.log("Building TS files done");
  }

  return res;
}
