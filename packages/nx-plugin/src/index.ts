export { createNodesV2 } from "./create-nodes.ts";

import { createNodesV2 } from "./create-nodes.ts";

const plugin = {
  name: "@tsparticles/cli-nx-plugin",
  createNodesV2,
};

export default plugin;
