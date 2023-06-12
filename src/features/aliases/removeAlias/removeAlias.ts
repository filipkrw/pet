import clc from "cli-color";
import { exec } from "../../core/exec.js";
import { loadCoreConfigs } from "../../core/loadConfigs/loadCoreConfigs.js";
import { ArgvOptions } from "../../core/types.js";
import { saveAliasesConfig } from "../createAlias/steps/updateAliasesConfig.js";
import { getUserShellData } from "../initAliases/steps/getUserShellData.js";
import { loadAliasesConfig } from "../initAliases/steps/loadAliasesConfig.js";
import { loadAliasesContent } from "../initAliases/steps/loadAliasesContent.js";
import { saveTransformedAliases } from "../initAliases/steps/saveTransformedAliases.js";
import { transformAliases } from "../initAliases/steps/transformAliases.js";
import { parseDeleteAliasArgv } from "./steps/parseDeleteAliasArgv.js";
import { removeAliasFromConfig } from "./steps/removeAliasFromConfig.js";
import { aliases } from "../Aliases.js";

export async function removeAlias({ argv }: ArgvOptions) {
  return (
    Promise.resolve(parseDeleteAliasArgv({ argv }))
      .then((x) => exec(x, aliases.getMeta))
      .then((x) => exec(x, loadCoreConfigs))
      .then((x) => exec(x, loadAliasesConfig))
      .then((x) => exec(x, removeAliasFromConfig))
      .then((x) => exec(x, saveAliasesConfig))
      //
      .then((x) => exec(x, loadAliasesContent))
      .then((x) => exec(x, getUserShellData))
      .then((x) => exec(x, transformAliases))
      .then((x) => exec(x, saveTransformedAliases))
      .then(() => console.log(clc.bold.green("Done!")))
  );
}
