import { describe, it, expect } from "vitest";
import { createShapeTemplate } from "../src/create/shape/create-shape";
import path from "path";
import fs from "fs-extra";

describe("create-shape", () => {
    it("should have created the shape project", async () => {
        const destDir = path.resolve(path.join(__dirname, "tmp-files", "foo-shape"));

        await createShapeTemplate("foo", "Foo", "", destDir);

        const pkgInfo = await fs.readJSON(path.join(destDir, "package.json"));

        expect(pkgInfo.name).toBe("tsparticles-shape-foo");

        await fs.remove(destDir);
    });

    it("should have created the shape project, w/ repo", async () => {
        const destDir = path.resolve(path.join(__dirname, "tmp-files", "bar-shape"));

        await createShapeTemplate("bar", "Bar", "https://github.com/matteobruni/tsparticles", destDir);

        const pkgInfo = await fs.readJSON(path.join(destDir, "package.json"));

        expect(pkgInfo.name).toBe("tsparticles-shape-bar");

        await fs.remove(destDir);
    });
});
