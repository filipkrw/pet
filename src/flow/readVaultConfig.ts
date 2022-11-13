import * as path from "node:path";
import { fileExists } from "../util/files.js";
import { importConfigFile } from "../util/importConfig.js";
import { LocalConfig } from "./readLocalConfig.js";
import { resolveVault } from "./resolveVault.js";
import { BaseConfig, VaultPaths } from "./types.js";

export async function readVaultConfig({
  localConfig,
}: {
  localConfig: LocalConfig;
}) {
  const rootVaultPaths = {
    absolutePath: localConfig.basePath,
    relativePath: "",
  };
  const vault = await resolveVault(rootVaultPaths, importVaultConfig);
  return { vault };
}

async function importVaultConfig(paths: VaultPaths): Promise<BaseConfig> {
  const vaultConfigAbsolutePath = getVaultConfigPath(paths.absolutePath);
  if (fileExists(vaultConfigAbsolutePath)) {
    const importedConfig = await importConfigFile(vaultConfigAbsolutePath);
    return { ...paths, ...importedConfig };
  }
  return paths;
}

function getVaultConfigPath(vaultAbsolutePath: string) {
  return path.join(vaultAbsolutePath, ".pet", "config.js");
}
