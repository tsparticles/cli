import { describe, it } from "mocha";
import { expect } from "chai";
import { createPresetTemplate } from "../src/create/preset/create-preset";
import path from "path";
import fs from "fs-extra";

describe("create-plugin", async () => {
    it("should have created the preset project", async () => {
        const destDir = path.resolve(path.join(__dirname, "tests", "tmp-files", "foo-preset"));

        await createPresetTemplate("foo", "Foo", "", destDir);

        const pkgInfo = await fs.readJSON(path.join(destDir, "package.json"));

        expect(pkgInfo.name).to.be.equal("tsparticles-preset-foo");

        await fs.remove(destDir);
    });

    it("should have created the preset project, w/ repo", async () => {
        const destDir = path.resolve(path.join(__dirname, "tests", "tmp-files", "bar-preset"));

        await createPresetTemplate("bar", "Bar", "https://github.com/matteobruni/tsparticles", destDir);

        const pkgInfo = await fs.readJSON(path.join(destDir, "package.json"));

        expect(pkgInfo.name).to.be.equal("tsparticles-preset-bar");

        await fs.remove(destDir);
    });
});
