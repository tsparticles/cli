import { describe, it } from "mocha";
import { expect } from "chai";
import fs from "fs-extra";
import path from "path";
import { replaceTokensInFile, replaceTokensInFiles } from "../src/utils/file-utils";

describe("file-utils", async () => {
    const baseDir = path.join(__dirname, "tests", "tmp-files");

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
});
