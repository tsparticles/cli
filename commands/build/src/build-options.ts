export interface BuildExecutionOptions {
  all: boolean;
  argPath: string;
  basePath: string;
  ci: boolean;
  circularDeps: boolean;
  clean: boolean;
  distfiles: boolean;
  doBundle: boolean;
  doLint: boolean;
  legacy: boolean;
  prettier: boolean;
  silent: boolean;
  tsc: boolean;
  useNx: boolean;
}
