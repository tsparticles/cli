import { type Container, type Engine, type IContainerPlugin } from "@tsparticles/engine";

export class PluginInstance implements IContainerPlugin {
    private readonly _container;
    private readonly _engine;

    constructor(container: Container, engine: Engine) {
        this._container = container;
        this._engine = engine;
    }

    async init(): Promise<void> {
        // add your plugin initialization here, replace the empty promise
        return await Promise.resolve();
    }
}
