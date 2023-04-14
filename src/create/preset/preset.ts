#!/usr/bin/env node
import { Command } from "commander";
import { createPresetTemplate } from "./create-preset";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

const presetCommand = new Command("preset");

presetCommand.description("Create a new tsParticles preset");
presetCommand.argument("<name>", "Preset name");
presetCommand.argument("<description>", "Preset description");
presetCommand.argument("<destination>", "Destination folder");
presetCommand.action(async (name: string, description: string, destination: string) => {
    let repoUrl: string;

    const destPath = path.resolve(".", destination),
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

    createPresetTemplate(name, description, repoUrl.trim(), destPath);
});

export { presetCommand };
