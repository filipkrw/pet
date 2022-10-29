import { dirname } from "node:path";
import { Flow } from "./Flow.mjs";

type RawConfig = { basePath: string };

function readPetConfig() {
  // const petConfig = (await importConfigFile(
  //   join(getRootPath(), "localConfig/petConfigs.js")
  // )) as RawConfig;
  // throw new Error("Some error occured here");
  return { basePath: "xd/xd" };
}

function addName(config: RawConfig) {
  return { ...config, name: dirname(config.basePath) };
}

function printName(config: RawConfig & { name: string }) {
  console.log(config.name);
}

export async function flow() {
  Flow.start()
    .then(readPetConfig)
    .then(addName)
    .then(printName)
    .catch((e) => console.log(e.message));
}
