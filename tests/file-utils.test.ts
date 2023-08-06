import { describe, it } from "mocha";
import { expect } from "chai";
import fs from "fs-extra";
import path from "path";
import {
    getDestinationDir,
    getRepositoryUrl,
    replaceTokensInFile,
    replaceTokensInFiles,
} from "../src/utils/file-utils";

describe("file-utils", async () => {
    const baseDir = path.join(__dirname, "tmp-files");

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

            expect(data1).to.be.equal("test1");
            expect(data2).to.be.equal("test2");
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

            expect(data).to.be.equal("test1");
        });
    });

    describe("get destination dir", async () => {
        const destDir = await getDestinationDir(path.join(baseDir, "baz"));

        it("should return the destination dir", () => {
            expect(destDir).to.be.equal(path.join(baseDir, "baz"));
        });

        it("should return the destination dir", async () => {
            const destDir2 = await getDestinationDir(path.join(baseDir, "baz"));

            expect(destDir2).to.be.equal(path.join(baseDir, "baz"));
        });

        it("should throw exception", async () => {
            await fs.writeFile(path.join(baseDir, "baz", "tmp.txt"), "");

            let ex = false;

            try {
                await getDestinationDir(path.join(baseDir, "baz"));

                console.log("never");
            } catch {
                ex = true;
            }

            expect(ex).to.be.equal(true);
        });
    });

    describe("get repository url", () => {
        it("should return the repository url", () => {
            expect(getRepositoryUrl()).to.be.not.equal("");
        });
    });

    after(async () => {
        await fs.remove(baseDir);
    });
});
