export interface BuildExecutionOptions {
  all: boolean;
  argPath: string;
  basePath: string;
  ci: boolean;
  circularDeps: boolean;
  clean: boolean;
  distfiles: boolean;
  doBundleRollup: boolean;
  doBundleWebpack: boolean;
  doLint: boolean;
  prettier: boolean;
  silent: boolean;
  tsc: boolean;
  useNx: boolean;
}
