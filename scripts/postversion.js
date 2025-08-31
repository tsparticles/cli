import fs from "fs-extra";
import path from "path";

const emptyProjectPkgPath = path.join(__dirname, "..", "files", "empty-project", "package.json");
const rootPkgPath = path.join(__dirname, "..", "package.json");

(async () => {
    try {
        // usa readJson/writeJson di fs-extra per evitare parse manuale e problemi di typing
        const pkg = await fs.readJson(rootPkgPath),
            obj = await fs.readJson(emptyProjectPkgPath);

        obj["devDependencies"] = obj["devDependencies"] || {};
        obj["devDependencies"]["@tsparticles/cli"] = `^${pkg.version}`;

        await fs.writeJson(emptyProjectPkgPath, obj, { spaces: 2 });
    }
    catch (err) {
        console.error(err);
    }
})();
