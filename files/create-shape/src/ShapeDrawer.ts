import type { IShapeDrawData, IShapeDrawer } from "@tsparticles/engine";

export class ShapeDrawer implements IShapeDrawer {
    async draw(_data: IShapeDrawData): Promise<void> {
        // draw the particle using the context
        // which is already centered in the particle position
        // colors are already handled, just draw the shape
        // the bounds are -radius to radius
        // delta is the frame time difference between the last frame and this one, in ms, use it for animated shapes
        // pixelRatio is the canvas ratio used by the tsParticles instance, you may need it for density-independent shapes
        // the parameters have an underscore prefix because they're not used in this example
        // the underscore prefix can be removed for used parameters, the unused ones can be removed too

        // remove this if there's already an await call
        await Promise.resolve();
    }
}
