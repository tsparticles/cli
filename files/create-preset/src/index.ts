import type { Engine } from "tsparticles-engine";
import { options } from "./options";

/**
 *
 * @param engine - the engine instance to load the preset into
 */
export function loadTemplatePreset(engine: Engine): void {
    // TODO: additional modules must be loaded here

    // Adds the preset to the engine, with the given options
    engine.addPreset("#template#", options);
}
