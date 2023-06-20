import { Command } from "commander";
import { presetCommand } from "./preset/preset.js";

const createCommand = new Command("create");

createCommand.description("Create a new tsParticles project");
createCommand.addCommand(presetCommand);

export { createCommand };
