import { describe, it, expect } from "vitest";
import { createPluginTemplate } from "../src/create/plugin/create-plugin.js";
import path from "node:path";
import fs from "fs-extra";

describe("create-plugin", () => {
    it("should have created the plugin project", async () => {
        const destDir = path.join(__dirname, "tmp-files", "foo-plugin"),
            pkgPath = path.join(destDir, "package.json");

        try {
            await createPluginTemplate("foo", "Foo", "", destDir);
        } catch (e) {
            console.error(e);
        }

        const pkgInfo = await fs.readJSON(pkgPath);

        expect(pkgInfo.name).toBe("tsparticles-plugin-foo");

        await fs.remove(destDir);
    });

    it("should have created the plugin project, w/ repo", async () => {
        const destDir = path.join(__dirname, "tmp-files", "bar-plugin");

        try {
            await createPluginTemplate("bar", "Bar", "https://github.com/matteobruni/tsparticles", destDir);
        } catch (e) {
            console.error(e);
        }

        const pkgPath = path.join(destDir, "package.json"),
            pkgInfo = await fs.readJSON(pkgPath);

        expect(pkgInfo.name).toBe("tsparticles-plugin-bar");

        await fs.remove(destDir);
    });
});
