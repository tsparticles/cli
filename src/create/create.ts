import { Command } from "commander";
import { pluginCommand } from "./plugin/plugin";
import { presetCommand } from "./preset/preset";
import { shapeCommand } from "./shape/shape";

const createCommand = new Command("create");

createCommand.description("Create a new tsParticles project");

createCommand.addCommand(pluginCommand);
createCommand.addCommand(presetCommand);
createCommand.addCommand(shapeCommand);

export { createCommand };
