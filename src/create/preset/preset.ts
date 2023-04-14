#!/usr/bin/env node
import prompts, { type PromptObject } from "prompts";
import { Command } from "commander";
import { capitalize } from "../../utils/string-utils";
import { createPresetTemplate } from "./create-preset";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

const presetCommand = new Command("preset");

presetCommand.description("Create a new tsParticles preset");
presetCommand.argument("<destination>", "Destination folder");
presetCommand.action(async (destination: string) => {
    let repoUrl: string;

    const destPath = path.resolve(path.join(process.cwd(), destination)),
        destExists = await fs.pathExists(destPath);

    if (destExists) {
        const destContents = await fs.readdir(destPath),
            destContentsNoGit = destContents.filter(t => t !== ".git" && t !== ".gitignore");

        if (destContentsNoGit.length) {
            throw new Error("Destination folder already exists and is not empty");
        }
    }

    await fs.ensureDir(destPath);

    try {
        repoUrl = execSync("git config --get remote.origin.url").toString();
    } catch {
        repoUrl = "";
    }

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
                initial: capitalize(initialName || ""),
            },
            {
                type: "text",
                name: "repositoryUrl",
                message: "What is the repository URL? (optional)",
                initial: repoUrl.trim(),
            },
        ];

    const { name, description, repositoryUrl } = await prompts(questions);

    createPresetTemplate(name.trim(), description.trim(), repositoryUrl.trim(), destPath);
});

export { presetCommand };
