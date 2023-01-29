import { exec } from "../../exec.js";
import { loadConfigs } from "../loadConfigs/loadConfigs.js";
import { ArgvOptions } from "../../types";
import { openFile } from "./openFile.js";
import { parseCreateArgv } from "./parseCreateArgv.js";
import { printMessage } from "./printMessage.js";

export async function create({ argv }: ArgvOptions) {
  return Promise.resolve(parseCreateArgv({ argv }))
    .then((x) => exec(x, loadConfigs))
    .then((x) => exec(x, openFile))
    .then((x) => printMessage(x));
}
