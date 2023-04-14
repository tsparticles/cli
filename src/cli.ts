#!/usr/bin/env node
import { buildCommand } from "./build/build";
import { createCommand } from "./create/create";
import pkgInfo from "../package.json";
import { program } from "commander";

program.name("tsparticles-cli build");
program.description("tsParticles Builder");
program.version(pkgInfo.version, "-v, --version", "output the current version");
program.addCommand(buildCommand);
program.addCommand(createCommand);
program.parse(process.argv);
