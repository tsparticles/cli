import type { Engine } from "@tsparticles/engine";

/**
 * @param engine - the engine instance to load the shape into
 */
export async function loadTemplateShape(engine: Engine): Promise<void> {
    const { ShapeDrawer } = await import("./ShapeDrawer.js");

    await engine.addShape(new ShapeDrawer());
}
