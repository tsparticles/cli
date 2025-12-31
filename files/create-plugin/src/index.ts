import type { Engine } from "@tsparticles/engine";

/**
 * @param engine - The engine instance
 */
export async function loadTemplatePlugin(engine: Engine): Promise<void> {
    const { Plugin } = await import("./plugin.js");

    await engine.addPlugin(new Plugin(/*engine*/));
}
