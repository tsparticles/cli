import {afterAll, describe, it, expect} from "vitest";
import fs from "fs-extra";
import path from "path";
import {
    getDestinationDir,
    getRepositoryUrl,
    replaceTokensInFile,
    replaceTokensInFiles,
} from "../src/utils/file-utils.js";

describe("file-utils", async () => {
    const baseDir = path.resolve("tmp-files");

    await fs.ensureDir(baseDir);

    describe("replace tokens in files", async () => {
        fs.writeFileSync(path.join(baseDir, "files1.txt"), "test");
        fs.writeFileSync(path.join(baseDir, "files2.txt"), "test");

        await replaceTokensInFiles([{
            path: path.join(baseDir, "files1.txt"),
            tokens: [{
                from: "test",
                to: "test1",
            }],
        }, {
            path: path.join(baseDir, "files2.txt"),
            tokens: [{
                from: "test",
                to: "test2",
            }],
        }]);

        it("should replace tokens in files", async () => {
            const data1 = await fs.readFile(path.join(baseDir, "files1.txt"), "utf8"),
                data2 = await fs.readFile(path.join(baseDir, "files2.txt"), "utf8");

            expect(data1).toBe("test1");
            expect(data2).toBe("test2");
        });
    });

    describe("replace tokens in file", async () => {
        fs.writeFileSync(path.join(baseDir, "file1.txt"), "test");

        await replaceTokensInFile({
            path: path.join(baseDir, "file1.txt"),
            tokens: [{
                from: "test",
                to: "test1",
            }],
        });

        it("should replace tokens in files", async () => {
            const data = await fs.readFile(path.join(baseDir, "file1.txt"), "utf8");

            expect(data).toBe("test1");
        });
    });

    describe("get destination dir", async () => {
        const destDir = await getDestinationDir(path.join("tmp-files", "baz"));

        it("should return the destination dir", () => {
            expect(destDir).toBe(path.join(baseDir, "baz"));
        });

        it("should return the destination dir", async () => {
            const destDir2 = await getDestinationDir(path.join("tmp-files", "baz"));

            expect(destDir2).toBe(path.join(baseDir, "baz"));
        });

        it("should throw exception", async () => {
            await fs.writeFile(path.join(baseDir, "baz", "tmp.txt"), "");

            let ex = false;

            try {
                await getDestinationDir(path.join("tmp-files", "baz"));

                console.log("never");
            } catch {
                ex = true;
            }

            expect(ex).toBe(true);
        });
    });

    describe("get repository url", () => {
        it("should return the repository url", async () => {
            expect(await getRepositoryUrl()).not.toBe("");
        });
    });

    afterAll(async () => {
        await fs.remove(baseDir);
    });
});
