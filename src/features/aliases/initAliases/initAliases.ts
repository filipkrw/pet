import { exec } from "../../core/exec.js";
import { loadConfigs } from "../../core/loadConfigs/loadConfigs.js";
import { getUserShellData } from "./steps/getUserShellData.js";
import { loadAliases } from "./steps/loadAliases.js";
import { mountAliases } from "./steps/mountAliases.js";
import { printMessage } from "./steps/printMessage.js";
import { transformAliases } from "./steps/transformAliases.js";
import { writeAliases } from "./steps/writeAliases.js";

export async function initAliases() {
  return Promise.resolve(loadConfigs())
    .then((x) => exec(x, getUserShellData))
    .then((x) => exec(x, loadAliases))
    .then((x) => exec(x, transformAliases))
    .then((x) => exec(x, writeAliases))
    .then((x) => exec(x, mountAliases))
    .then((x) => exec(x, printMessage));
}
