import { exec } from "../../exec.js";
import { loadConfigs } from "../../loadConfigs/loadConfigs.js";
import { getUserShellData } from "./getUserShellData.js";
import { loadAliases } from "./loadAliases.js";
import { mountAliases } from "./mountAliases.js";
import { printMessage } from "./printMessage.js";
import { transformAliases } from "./transformAliases.js";
import { writeAliases } from "./writeAliases.js";

export async function initAliases() {
  return Promise.resolve(loadConfigs())
    .then((x) => exec(x, getUserShellData))
    .then((x) => exec(x, loadAliases))
    .then((x) => exec(x, transformAliases))
    .then((x) => exec(x, writeAliases))
    .then((x) => exec(x, mountAliases))
    .then((x) => exec(x, printMessage));
}
