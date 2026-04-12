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

type CompileResult = {
  exitCode: ExitCodes;
  logs: string[];
  type: "browser" | "cjs" | "esm" | "types";
};

function getDefaultOptions(type: "browser" | "cjs" | "esm" | "types"): unknown {
  switch (type) {
    case "browser":
      return {
        extends: "@tsparticles/tsconfig/dist/tsconfig.browser.json",
        compilerOptions: {
          rootDir: "./src",
          outDir: "./dist/browser",
        },
        include: ["./src"],
      };
    case "cjs":
      return {
        extends: "@tsparticles/tsconfig/dist/tsconfig.json",
        compilerOptions: {
          rootDir: "./src",
          outDir: "./dist/cjs",
        },
        include: ["./src"],
      };
    case "esm":
      return {
        extends: "@tsparticles/tsconfig/dist/tsconfig.module.json",
        compilerOptions: {
          rootDir: "./src",
          outDir: "./dist/esm",
        },
        include: ["./src"],
      };
    case "types":
      return {
        extends: "@tsparticles/tsconfig/dist/tsconfig.types.json",
        compilerOptions: {
          rootDir: "./src",
          outDir: "./dist/types",
        },
        include: ["./src"],
      };
  }
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
async function compile(
  basePath: string,
  type: "browser" | "cjs" | "esm" | "types",
  silent: boolean,
): Promise<CompileResult> {
  let options: unknown, data: string | undefined;
  const logs: string[] = [];

  switch (type) {
    case "browser":
      data = await readConfig(basePath, "tsconfig.browser.json");

      if (!data) {
        options = getDefaultOptions(type);
      }

      break;
    case "cjs":
      data = await readConfig(basePath, "tsconfig.json");

      if (!data) {
        options = getDefaultOptions(type);
      }

      break;
    case "esm":
      data = await readConfig(basePath, "tsconfig.module.json");

      if (!data) {
        options = getDefaultOptions(type);
      }

      break;
    case "types":
      data = await readConfig(basePath, "tsconfig.types.json");

      if (!data) {
        options = getDefaultOptions(type);
      }

      break;
  }

  if (!data && !options) {
    logs.push(`No TS config found for ${type} build.`);

    return {
      type,
      logs,
      exitCode: ExitCodes.NoDataOrOptions,
    };
  }

  if (!options && data) {
    options = JSON.parse(data);
  }

  if (!options) {
    logs.push(`No TS options available for ${type} build.`);

    return {
      type,
      logs,
      exitCode: ExitCodes.NoOptions,
    };
  }

  const ts = await import("typescript");
  let parsed = ts.parseJsonConfigFileContent(options, ts.sys, basePath);

  if (parsed.errors.length && type === "cjs" && data) {
    const noInputsCode = 18003,
      hasNoInputsError = parsed.errors.some(diagnostic => diagnostic.code === noInputsCode);

    if (hasNoInputsError) {
      options = getDefaultOptions(type);
      parsed = ts.parseJsonConfigFileContent(options, ts.sys, basePath);

      if (!silent) {
        logs.push("Using default cjs build options because tsconfig.json has no input files for this build.");
      }
    }
  }

  if (parsed.errors.length) {
    for (const diagnostic of parsed.errors) {
      logs.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }

    return {
      type,
      logs,
      exitCode: ExitCodes.ParseError,
    };
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

      logs.push(
        `${diagnostic.file.fileName} (${(line + increment).toString()},${(character + increment).toString()}): ${message}`,
      );
    } else {
      logs.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  }

  const exitCode = emitResult.emitSkipped || failed ? ExitCodes.EmitErrors : ExitCodes.OK;

  if (!silent || exitCode) {
    logs.push(`TSC for ${type} done with exit code: '${exitCode.toLocaleString()}'.`);
  }

  return {
    type,
    logs,
    exitCode,
  };
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

  const types: ("browser" | "cjs" | "esm" | "types")[] = ["browser", "cjs", "esm", "types"];

  const results = await Promise.all(types.map(type => compile(basePath, type, silent)));

  for (const type of types) {
    const result = results.find(r => r.type === type);

    if (!result) {
      continue;
    }

    if (!silent) {
      console.log(`Building TS files for ${type} configuration`);
    }

    for (const log of result.logs) {
      console.log(log);
    }
  }

  const res = results.every(result => result.exitCode === ExitCodes.OK);

  if (!silent) {
    console.log("Building TS files done");
  }

  return res;
}
