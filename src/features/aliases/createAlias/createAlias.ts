import clc from "cli-color";
import { exec } from "../../core/exec.js";
import { loadCoreConfigs } from "../../core/loadConfigs/loadCoreConfigs.js";
import { ArgvOptions } from "../../core/types.js";
import { getUserShellData } from "../initAliases/steps/getUserShellData.js";
import { loadAliasesConfig } from "../initAliases/steps/loadAliasesConfig.js";
import { loadAliasesContent } from "../initAliases/steps/loadAliasesContent.js";
import { saveTransformedAliases } from "../initAliases/steps/saveTransformedAliases.js";
import { transformAliases } from "../initAliases/steps/transformAliases.js";
import { addNewAlias } from "./steps/addNewAlias.js";
import { parseCreateAliasArgv } from "./steps/parseCreateAliasArgv.js";
import { saveAliasesConfig } from "./steps/updateAliasesConfig.js";

export async function createAlias({ argv }: ArgvOptions) {
  return (
    Promise.resolve(parseCreateAliasArgv({ argv }))
      .then((x) => exec(x, loadCoreConfigs))
      .then((x) => exec(x, loadAliasesConfig))
      .then((x) => exec(x, addNewAlias))
      .then((x) => exec(x, saveAliasesConfig))
      //
      .then((x) => exec(x, loadAliasesContent))
      .then((x) => exec(x, getUserShellData))
      .then((x) => exec(x, transformAliases))
      .then((x) => exec(x, saveTransformedAliases))
      .then(() => console.log(clc.bold.green("Done!")))
  );
}
