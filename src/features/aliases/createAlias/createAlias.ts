import { exec } from "../../core/exec.js";
import { getVaultConfigPath } from "../../core/loadConfigs/getVaultConfigPath.js";
import { loadConfigs } from "../../core/loadConfigs/loadConfigs.js";
import {
  ArgvOptions,
  LocalConfig,
  VaultWithSubVaults,
} from "../../core/types.js";
import { getUserShellData } from "../initAliases/steps/getUserShellData.js";
import { parseCreateAliasArgv } from "./steps/parseCreateAliasArgv.js";
import fs from "fs/promises";

export async function createAlias({ argv }: ArgvOptions) {
  return Promise.resolve(parseCreateAliasArgv({ argv }))
    .then((x) => exec(x, loadConfigs))
    .then((x) => exec(x, getUserShellData))
    .then((x) => exec(x, saveAliasToConfig));
}

async function saveAliasToConfig({
  args,
  vault,
  localConfig,
}: ReturnType<typeof parseCreateAliasArgv> & {
  vault: VaultWithSubVaults;
  localConfig: LocalConfig;
}) {
  const newAlias = {
    alias: args.alias,
    relativePath: args.noteRelativePath,
  };
  const updatedAliases = [...(vault.aliases || []), newAlias];

  console.log(updatedAliases);

  // const vaultConfigPath = getVaultConfigPath(vault.absolutePath);
  // const configContent = await fs.readFile(vaultConfigPath, "utf-8");
  // const jsonConfigContent = JSON.parse(configContent);

  // const updatedConfig = {
  //   ...jsonConfigContent,
  //   aliases: updatedAliases,
  // };

  // await fs.writeFile(vaultConfigPath, JSON.stringify(updatedConfig, null, 2));
}
