import * as path from "node:path";
import { getRootPath } from "../util/getRootPath.js";
import { importConfigFile } from "../util/importConfig.js";

export type LocalConfig = {
  basePath: string;
};

export async function readLocalConfig() {
  return {
    localConfig: await importLocalConfig(),
  };
}

async function importLocalConfig() {
  const petConfig = (await importConfigFile(
    path.join(getRootPath(), "localConfig/petConfig.js")
  )) as LocalConfig;
  return petConfig;
}