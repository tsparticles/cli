#!/usr/bin/env node
import { buildCommand } from "@tsparticles/cli-command-build";
import { createCommand } from "@tsparticles/cli-command-create";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { program } from "commander";
import { readFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url),
  __dirname = path.dirname(__filename),
  rootPkgPath = path.join(__dirname, "..", "package.json"),
  pkg = JSON.parse(await readFile(rootPkgPath, "utf-8")) as { version: string };

program.name("tsparticles-cli");
program.description("tsParticles CLI");
program.version(pkg.version, "-v, --version", "output the current version");
program.addCommand(buildCommand);
program.addCommand(createCommand);
program.parse(process.argv);
