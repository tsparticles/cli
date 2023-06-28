import type { IDelta, IShapeDrawer, Particle } from "tsparticles-engine";

export class ShapeDrawer implements IShapeDrawer {
    draw(_context: CanvasRenderingContext2D,
         _particle: Particle,
         _radius: number,
         _opacity: number,
         _delta: IDelta,
         _pixelRatio: number): void {
        // draw the particle using the context
        // which is already centered in the particle position
        // colors are already handles, just draw the shape
        // the bounds are -radius to radius
        // delta is the frame time difference between the last frame and this one, in ms, use it for animated shapes
        // pixelRatio is the canvas ratio used by the tsParticles instance, you may need it for density-independent shapes
        // the parameters have an underscore prefix because they're not used in this example
        // the underscore prefix can be removed for used parameters, the unused ones can be removed too
    }
}
