import { exec } from "../../core/exec.js";
import { loadCoreConfigs } from "../../core/loadConfigs/loadCoreConfigs.js";
import { getUserShellData } from "./steps/getUserShellData.js";
import { loadAliasesContent } from "./steps/loadAliasesContent.js";
import { loadAliasesConfig } from "./steps/loadAliasesConfig.js";
import { mountAliases } from "./steps/mountAliases.js";
import { printMessage } from "./steps/printMessage.js";
import { transformAliases } from "./steps/transformAliases.js";
import { saveTransformedAliases } from "./steps/saveTransformedAliases.js";
import { aliases } from "../Aliases.js";

export async function initAliases() {
  return Promise.resolve(aliases.getMeta())
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, loadAliasesConfig))
    .then((x) => exec(x, loadAliasesContent))
    .then((x) => exec(x, getUserShellData))
    .then((x) => exec(x, transformAliases))
    .then((x) => exec(x, saveTransformedAliases))
    .then((x) => exec(x, mountAliases))
    .then((x) => exec(x, printMessage));
}
