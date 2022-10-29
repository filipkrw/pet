import { dirname, join } from "node:path";
import { getRootPath } from "../util/getRootPath.js";
import { importConfigFile } from "../util/importConfig.mjs";
import { Flow } from "./Flow.mjs";

type RawConfig = { basePath: string };

function readPetConfig() {
  // const petConfig = (await importConfigFile(
  //   join(getRootPath(), "localConfig/petConfigs.js")
  // )) as RawConfig;
  return { basePath: "xd/xd" };
}

function addName(config: RawConfig) {
  return { ...config, name: dirname(config.basePath) };
}

export async function flow() {
  const config = Flow.from(readPetConfig()).then(addName);
  console.log(config);
}
