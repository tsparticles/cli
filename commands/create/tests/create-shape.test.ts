import { describe, it, expect } from "vitest";
import { readFile, rm } from "node:fs/promises";
import { createShapeTemplate } from "../src/shape/create-shape.js";
import path from "node:path";

describe("create-shape", () => {
  it("should have created the shape project", async () => {
    const destDir = path.join(__dirname, "tmp-files", "foo-shape");

    try {
      await createShapeTemplate("foo", "Foo", "", destDir);
    } catch (e) {
      console.error(e);
    }

    const pkgPath = path.join(destDir, "package.json"),
      pkgInfo = JSON.parse(await readFile(pkgPath, "utf-8"));

    expect(pkgInfo.name).toBe("tsparticles-shape-foo");

    await rm(destDir, { recursive: true, force: true });
  });

  it("should have created the shape project, w/ repo", async () => {
    const destDir = path.join(__dirname, "tmp-files", "bar-shape");

    try {
      await createShapeTemplate("bar", "Bar", "https://github.com/matteobruni/tsparticles", destDir);
    } catch (e) {
      console.error(e);
    }

    const pkgPath = path.join(destDir, "package.json"),
      pkgInfo = JSON.parse(await readFile(pkgPath, "utf-8"));

    expect(pkgInfo.name).toBe("tsparticles-shape-bar");

    await rm(destDir, { recursive: true, force: true });
  });
});
