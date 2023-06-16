import clc from "cli-color";
import { exec } from "../../../core/exec.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { ArgvOptions } from "../../../cli/types.js";
import { aliases } from "../Aliases.js";
import { getUserShellData } from "../initAliases/steps/getUserShellData.js";
import { loadAliasesConfig } from "../initAliases/steps/loadAliasesConfig.js";
import { loadAliasesContent } from "../initAliases/steps/loadAliasesContent.js";
import { saveTransformedAliases } from "../initAliases/steps/saveTransformedAliases.js";
import { transformAliases } from "../initAliases/steps/transformAliases.js";
import { addAliasToConfig } from "./steps/addAliasToConfig.js";
import { parseCreateAliasArgv } from "./steps/parseCreateAliasArgv.js";
import { saveAliasesConfig } from "./steps/updateAliasesConfig.js";
import { Alias } from "../schemas/aliasSchema.js";
import { FeatureMeta } from "../../../core/Feature.js";
import { LocalConfig, Vault } from "../../../core/types.js";

export async function createAlias({ argv }: ArgvOptions) {
  return Promise.resolve({ ...aliases.getMeta(), argv })
    .then((x) => exec(x, parseCreateAliasArgv))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, execCreateAlias));
}

export async function execCreateAlias(data: {
  feature: FeatureMeta;
  newAlias: Alias;
  localConfig: LocalConfig;
  vaults: Vault[];
  disabledVaults: Vault[];
}) {
  return (
    Promise.resolve(data)
      .then((x) => exec(x, loadAliasesConfig))
      .then((x) => exec(x, addAliasToConfig))
      .then((x) => exec(x, saveAliasesConfig))
      //
      .then((x) => exec(x, loadAliasesConfig))
      .then((x) => exec(x, loadAliasesContent))
      .then((x) => exec(x, getUserShellData))
      .then((x) => exec(x, transformAliases))
      .then((x) => exec(x, saveTransformedAliases))
      .then((x) => {
        console.log(clc.bold.green("Done!"));
        return x;
      })
  );
}
