import { describe, it, expect } from "vitest";
import { createPluginTemplate } from "../src/create/plugin/create-plugin";
import path from "path";
import fs from "fs-extra";

describe("create-plugin", () => {
    it("should have created the plugin project", async () => {
        const destDir = path.resolve(path.join(__dirname, "tmp-files", "foo-plugin"));

        await createPluginTemplate("foo", "Foo", "", destDir);

        const pkgInfo = await fs.readJSON(path.join(destDir, "package.json"));

        expect(pkgInfo.name).toBe("tsparticles-plugin-foo");

        await fs.remove(destDir);
    });

    it("should have created the plugin project, w/ repo", async () => {
        const destDir = path.resolve(path.join(__dirname, "tmp-files", "bar-plugin"));

        await createPluginTemplate("bar", "Bar", "https://github.com/matteobruni/tsparticles", destDir);

        const pkgInfo = await fs.readJSON(path.join(destDir, "package.json"));

        expect(pkgInfo.name).toBe("tsparticles-plugin-bar");

        await fs.remove(destDir);
    });
});
