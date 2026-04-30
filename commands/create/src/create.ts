import { Command } from "commander";
import { pluginCommand } from "./plugin/plugin.js";
import { presetCommand } from "./preset/preset.js";
import { shapeCommand } from "./shape/shape.js";

const createCommand = new Command("create");

createCommand.description("Create a new tsParticles project");

createCommand.addCommand(pluginCommand);
createCommand.addCommand(presetCommand);
createCommand.addCommand(shapeCommand);

export { createCommand };
