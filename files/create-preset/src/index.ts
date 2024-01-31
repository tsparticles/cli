import type { Engine } from "@tsparticles/engine";

/**
 *
 * @param engine - the engine instance to load the preset into
 */
export async function loadTemplatePreset(engine: Engine): Promise<void> {
    const { options } = await import("./options");

    // TODO: additional modules must be loaded here

    // Adds the preset to the engine, with the given options
    await engine.addPreset("#template#", options);
}
