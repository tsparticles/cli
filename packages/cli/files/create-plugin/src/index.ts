import type { Engine } from "@tsparticles/engine";
import { Plugin } from "./plugin.js";

/**
 * @param engine - The engine instance
 */
export async function loadTemplatePlugin(engine: Engine): Promise<void> {
    await engine.addPlugin(new Plugin(/*engine*/));
}
