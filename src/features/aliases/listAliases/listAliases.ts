import { exec } from "../../core/exec.js";
import { loadCoreConfigs } from "../../core/loadConfigs/loadCoreConfigs.js";
import { loadAliasesConfig } from "../initAliases/steps/loadAliasesConfig.js";
import { loadAliasesContent } from "../initAliases/steps/loadAliasesContent.js";
import { printAliases } from "./steps/printAliases.js";

export async function listAliases() {
  return Promise.resolve(loadCoreConfigs())
    .then((x) => exec(x, loadAliasesConfig))
    .then((x) => exec(x, loadAliasesContent))
    .then((x) => exec(x, printAliases));
}
