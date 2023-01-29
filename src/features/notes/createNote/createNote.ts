import { exec } from "../../core/exec.js";
import { loadCoreConfigs } from "../../core/loadConfigs/loadCoreConfigs.js";
import { ArgvOptions } from "../../core/types.js";
import { openFile } from "./openFile.js";
import { parseCreateArgv } from "./parseCreateArgv.js";
import { printMessage } from "./printMessage.js";

export async function createNote({ argv }: ArgvOptions) {
  return Promise.resolve(parseCreateArgv({ argv }))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, openFile))
    .then((x) => printMessage(x));
}
