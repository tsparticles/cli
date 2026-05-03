import { createParticlesBuild } from "./createParticlesBuild";
import type { ParticlesBuildParams } from "./types";

export const loadParticlesBundle = (p: ParticlesBuildParams) =>
  createParticlesBuild("bundle", p);

export const loadParticlesPlugin = (p: ParticlesBuildParams) =>
  createParticlesBuild("plugin", p);

export const loadParticlesEngine = (p: ParticlesBuildParams) =>
  createParticlesBuild("engine", p);

export const loadParticlesEffect = (p: ParticlesBuildParams) =>
  createParticlesBuild("effect", p);

export const loadParticlesInteraction = (p: ParticlesBuildParams) =>
  createParticlesBuild("interaction", p);

export const loadParticlesInteractionExternal = (p: ParticlesBuildParams) =>
  createParticlesBuild("interactionExternal", p);

export const loadParticlesInteractionParticles = (p: ParticlesBuildParams) =>
  createParticlesBuild("interactionParticles", p);

export const loadParticlesPalette = (p: ParticlesBuildParams) =>
  createParticlesBuild("palette", p);

export const loadParticlesPath = (p: ParticlesBuildParams) =>
  createParticlesBuild("path", p);

export const loadParticlesPluginEasing = (p: ParticlesBuildParams) =>
  createParticlesBuild("pluginEasing", p);

export const loadParticlesPluginEmittersShape = (p: ParticlesBuildParams) =>
  createParticlesBuild("pluginEmittersShape", p);

export const loadParticlesPluginExport = (p: ParticlesBuildParams) =>
  createParticlesBuild("pluginExport", p);

export const loadParticlesPreset = (p: ParticlesBuildParams) =>
  createParticlesBuild("preset", p);

export const loadParticlesShape = (p: ParticlesBuildParams) =>
  createParticlesBuild("shape", p);

export const loadParticlesTemplate = (p: ParticlesBuildParams) =>
  createParticlesBuild("template", p);

export const loadParticlesUpdater = (p: ParticlesBuildParams) =>
  createParticlesBuild("updater", p);

export { createParticlesBuild } from "./createParticlesBuild";
export type { ParticlesBuildType } from "./buildMap";
