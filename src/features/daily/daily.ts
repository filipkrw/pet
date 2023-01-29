import { exec } from "../exec.js";
import { loadConfigs } from "../core/loadConfigs/loadConfigs.js";
import { ArgvOptions } from "../types";
import { openEditor } from "../core/create/openEditor.js";
import { printMessage } from "../core/create/printMessage.js";
import { parseDailyCreateArgv } from "./parseDailyCreateArgv.js";
import { createDailyFile } from "./createFileWithFronmatter.js";
import { deleteFileIfEmpty } from "./deleteFileIfEmpty.js";

export async function daily({ argv }: ArgvOptions) {
  return Promise.resolve(parseDailyCreateArgv({ argv })) // Changed
    .then((x) => exec(x, loadConfigs))
    .then((x) => exec(x, createDailyFile)) // Changed
    .then((x) => exec(x, openEditor))
    .then((x) => exec(x, deleteFileIfEmpty)) // Changed
    .then((x) => printMessage(x));
}
