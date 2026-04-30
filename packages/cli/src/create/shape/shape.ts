import { getDestinationDir, getRepositoryUrl } from "../../utils/file-utils.js";
import prompts, { type PromptObject } from "prompts";
import { Command } from "commander";
import { capitalize } from "../../utils/string-utils.js";
import { createShapeTemplate } from "./create-shape.js";
import path from "node:path";

const shapeCommand = new Command("shape");

shapeCommand.description("Create a new tsParticles shape");
shapeCommand.argument("<destination>", "Destination folder");
shapeCommand.action(async (destination: string) => {
  const destPath = await getDestinationDir(destination),
    repoUrl = await getRepositoryUrl(),
    initialName = destPath.split(path.sep).pop(),
    questions: PromptObject[] = [
      {
        type: "text",
        name: "name",
        message: "What is the name of the shape?",
        validate: (value: string) => (value ? true : "The name can't be empty"),
        initial: initialName,
      },
      {
        type: "text",
        name: "description",
        message: "What is the description of the shape?",
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

  await createShapeTemplate(name.trim(), description.trim(), repositoryUrl.trim(), destPath);
});

export { shapeCommand };
