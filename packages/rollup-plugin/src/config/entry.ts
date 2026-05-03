export interface EntryParams {
  bundle: boolean;
  format: string;
  lazy: boolean;
  min: boolean;
  name?: string;
}

export const getEntry = (data: EntryParams) => {
  const { bundle, format, lazy, min, name } = data,
    fileName = bundle ? "bundle" : "index",
    completeFileName = lazy ? `${fileName}.lazy` : fileName,
    fixFormat = format ? `.${format}` : "",
    fixName = name ? `.${name}` : "",
    fixMin = min ? ".min" : "",
    fixLazy = lazy ? ".lazy" : "";

  return {
    name: `tsparticles${fixFormat}${fixName}${fixLazy}${fixMin}`,
    input: `./dist/browser/${completeFileName}.js`,
  };
};
