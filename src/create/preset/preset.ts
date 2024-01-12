import { getDestinationDir, getRepositoryUrl } from "../../utils/file-utils";
import prompts, { type PromptObject } from "prompts";
import { Command } from "commander";
import { capitalize } from "../../utils/string-utils";
import { createPresetTemplate } from "./create-preset";
import path from "path";

const presetCommand = new Command("preset");

presetCommand.description("Create a new tsParticles preset");
presetCommand.argument("<destination>", "Destination folder");
presetCommand.action(async (destination: string) => {
    const destPath = await getDestinationDir(destination),
        repoUrl = await getRepositoryUrl();

    const initialName = destPath.split(path.sep).pop(),
        questions: PromptObject[] = [
            {
                type: "text",
                name: "name",
                message: "What is the name of the preset?",
                validate: (value: string) => (value ? true : "The name can't be empty"),
                initial: initialName,
            },
            {
                type: "text",
                name: "description",
                message: "What is the description of the preset?",
                validate: (value: string) => (value ? true : "The description can't be empty"),
                initial: capitalize(initialName ?? ""),
            },
            {
                type: "text",
                name: "repositoryUrl",
                message: "What is the repository URL? (optional)",
                initial: repoUrl.trim(),
            },
        ];

    const { name, description, repositoryUrl } = (await prompts(questions)) as {
        description: string;
        name: string;
        repositoryUrl: string;
    };

    await createPresetTemplate(name.trim(), description.trim(), repositoryUrl.trim(), destPath);
});

export { presetCommand };
