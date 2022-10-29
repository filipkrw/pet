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

export async function flow() {
  const x = Flow.from(null)
    .pipe(readPetConfig)
    .pipe(addName)
    .catch((e) => console.log(e.value.message))
    .finally((data) => console.log(data));
  // console.log(x);
}
