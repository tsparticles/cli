import { getDestinationDir, getRepositoryUrl } from "../../utils/file-utils.js";
import prompts, { type PromptObject } from "prompts";
import { Command } from "commander";
import { capitalize } from "../../utils/string-utils.js";
import { createPluginTemplate } from "./create-plugin.js";
import path from "node:path";

const pluginCommand = new Command("plugin");

pluginCommand.description("Create a new tsParticles plugin");
pluginCommand.argument("<destination>", "Destination folder");
pluginCommand.action(async (destination: string) => {
  const destPath = await getDestinationDir(destination),
    repoUrl = await getRepositoryUrl(),
    initialName = destPath.split(path.sep).pop(),
    questions: PromptObject[] = [
      {
        type: "text",
        name: "name",
        message: "What is the name of the plugin?",
        validate: (value: string) => (value ? true : "The name can't be empty"),
        initial: initialName,
      },
      {
        type: "text",
        name: "description",
        message: "What is the description of the plugin?",
        validate: (value: string) => (value ? true : "The description can't be empty"),
        initial: capitalize(initialName ?? ""),
      },
      {
        type: "text",
        name: "repositoryUrl",
        message: "What is the repository URL? (optional)",
        initial: repoUrl.trim(),
      },
    ],
    { name, description, repositoryUrl } = (await prompts(questions)) as {
      description: string;
      name: string;
      repositoryUrl: string;
    };

  await createPluginTemplate(name.trim(), description.trim(), repositoryUrl.trim(), destPath);
});

export { pluginCommand };
