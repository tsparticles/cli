const pkg = require("../package.json");
const fs = require("fs-extra");
const path = require("path");

const emptyProjectPkgPath = path.join(__dirname, "..", "files", "empty-project", "package.json");

(async () => {
    await fs.readFile(emptyProjectPkgPath, "utf8", (err, data) => {
        if (err) {
            console.error(err);

            return;
        }

        const obj = JSON.parse(data);

        obj["devDependencies"]["@tsparticles/cli"] = `^${pkg.version}`;

        const result = JSON.stringify(obj, undefined, 2);

        fs.writeFile(emptyProjectPkgPath, `${result}\n`, "utf8", (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
})();
