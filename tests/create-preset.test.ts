import { describe, it, expect } from "vitest";
import { createPresetTemplate } from "../src/create/preset/create-preset.js";
import path from "path";
import fs from "fs-extra";

describe("create-preset", () => {
    it("should have created the preset project", async () => {
        const destDir = path.join(__dirname, "tmp-files", "foo-preset");

        try {
            await createPresetTemplate("foo", "Foo", "", destDir);
        } catch (e) {
            console.error(e);
        }

        const pkgPath = path.join(destDir, "package.json"),
            pkgInfo = await fs.readJSON(pkgPath);

        expect(pkgInfo.name).toBe("tsparticles-preset-foo");

        await fs.remove(destDir);
    });

    it("should have created the preset project, w/ repo", async () => {
        const destDir = path.join(__dirname, "tmp-files", "bar-preset");

        try {
            await createPresetTemplate("bar", "Bar", "https://github.com/matteobruni/tsparticles", destDir);
        } catch (e) {
            console.error(e);
        }

        const pkgPath = path.join(destDir, "package.json"),
            pkgInfo = await fs.readJSON(pkgPath);

        expect(pkgInfo.name).toBe("tsparticles-preset-bar");

        await fs.remove(destDir);
    });
});
