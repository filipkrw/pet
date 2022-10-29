import { dirname, join } from "node:path";
import { getRootPath } from "../util/getRootPath.js";
import { importConfigFile } from "../util/importConfig.mjs";
import { Flow } from "./Flow.mjs";

type RawConfig = { basePath: string };

async function readPetConfig() {
  const petConfig = (await importConfigFile(
    join(getRootPath(), "localConfig/petConfigs.js")
  )) as RawConfig;
  return petConfig;
}

async function addName(config: RawConfig) {
  return { ...config, name: dirname(config.basePath) };
}

export async function flow() {
  const config = await (await Flow.from(readPetConfig)).pipe(addName);
  console.log(config);
}
