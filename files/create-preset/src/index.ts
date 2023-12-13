import type { Engine } from "@tsparticles/engine";
import { options } from "./options";

/**
 *
 * @param engine - the engine instance to load the preset into
 */
export async function loadTemplatePreset(engine: Engine): Promise<void> {
    // TODO: additional modules must be loaded here

    // Adds the preset to the engine, with the given options
    await engine.addPreset("#template#", options);
}
