import type { Engine } from "@tsparticles/engine";
import { ShapeDrawer } from "./ShapeDrawer";

/**
 * @param engine - the engine instance to load the shape into
 */
export async function loadTemplateShape(engine: Engine): Promise<void> {
    await engine.addShape("#template#", new ShapeDrawer());
}
