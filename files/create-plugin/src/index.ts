import type { Container, Engine, IPlugin, ISourceOptions, Options } from "@tsparticles/engine";
import { PluginInstance } from "./PluginInstance";

/**
 */
class Plugin implements IPlugin {
    readonly id;

    private readonly _engine;

    constructor(engine: Engine) {
        this.id = "#template#";

        this._engine = engine;
    }

    getPlugin(container: Container): PluginInstance {
        return new PluginInstance(container, this._engine);
    }

    loadOptions(_options: Options, _source?: ISourceOptions): void {
        if (!this.needsPlugin()) {
            return;
        }

        // Load your options here
    }

    needsPlugin(_options?: ISourceOptions): boolean {
        return true; // add your condition here
    }
}

/**
 * @param engine - The engine instance
 */
export async function loadTemplatePlugin(engine: Engine): Promise<void> {
    await engine.addPlugin(new Plugin(engine));
}
