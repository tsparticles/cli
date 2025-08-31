import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {defineConfig} from "eslint/config";
import tsParticlesESLintConfig from "@tsparticles/eslint-config";

export default defineConfig([
    tsParticlesESLintConfig,
    {
        languageOptions: {
            parserOptions: {
                // Usa il tsconfig nella cartella src che contiene i sorgenti effettivi
                project: [path.resolve(__dirname, "src/tsconfig.json")],
                tsconfigRootDir: __dirname,
                sourceType: "module"
            }
        },
        rules: {
            "no-console": "off"
        }
    }
]);
