#!/usr/bin/env node
import { buildCommand } from "./build/build.js";
import { createCommand } from "./create/create.js";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import path from "path";
import { program } from "commander";

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename),
    rootPkgPath = path.join(__dirname, "..", "package.json"),
    pkg = (await fs.readJson(rootPkgPath)) as { version: string };

program.name("tsparticles-cli");
program.description("tsParticles CLI");
program.version(pkg.version, "-v, --version", "output the current version");
program.addCommand(buildCommand);
program.addCommand(createCommand);
program.parse(process.argv);
