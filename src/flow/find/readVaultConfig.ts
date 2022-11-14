import * as path from "node:path";
import { fileExists } from "../../util/files.js";
import { importConfigFile } from "../../util/importConfig.js";
import { Vault, VaultWithSubVaults } from "../../vault/types.js";
import { LocalConfig } from "./readLocalConfig.js";

export async function readVaultConfig({
  localConfig,
}: {
  localConfig: LocalConfig;
}): Promise<{ vault: VaultWithSubVaults }> {
  const rootVaultPaths = {
    absolutePath: localConfig.basePath,
    relativePath: "",
  };
  const rootVault = await importVaultConfigWithSubVaults(rootVaultPaths);
  return { vault: rootVault };
}

async function importVaultConfigWithSubVaults(
  paths: {
    absolutePath: string;
    relativePath: string;
  },
  subVaults?: Vault[]
): Promise<VaultWithSubVaults> {
  const vault = await importVaultConfig(paths);

  if (vault.vaults) {
    const subVaults = vault.vaults.map((subvault) =>
      importVaultConfig({
        ...subvault,
        absolutePath: path.join(paths.absolutePath, subvault.relativePath),
      })
    );
    return {
      ...vault,
      vaults: await Promise.all(subVaults),
    };
  }

  return { ...vault, vaults: subVaults };
}

async function importVaultConfig(paths: {
  absolutePath: string;
  relativePath: string;
}): Promise<VaultWithSubVaults> {
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
