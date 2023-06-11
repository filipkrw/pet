import * as path from "node:path";
import CommandError from "../../../legacy/handleAlias/CommandError.js";
import { fileExists } from "../../../util/files.js";
import { importConfigFile } from "../../../util/importConfig.js";
import { LocalConfig, Vault, VaultWithSubVaults } from "../../core/types.js";
import { Feature } from "../../types.js";
import { getVaultConfigPath } from "./getVaultConfigPath.js";

export async function readVaultConfig({
  localConfig,
  feature,
}: {
  localConfig: LocalConfig;
  feature: Feature;
}): Promise<{ vault: VaultWithSubVaults }> {
  const rootVaultPaths = {
    absolutePath: localConfig.basePath,
    relativePath: "",
  };
  const rootVault = await importVaultConfigWithSubVaults(rootVaultPaths);
  const filteredVaults = filterOutVaults(rootVault, feature);
  if (!filteredVaults) {
    throw new CommandError(
      `No vaults found for feature "${feature.name}" in "${localConfig.basePath}"`
    );
  }
  return { vault: filteredVaults };
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

function shouldKeepVault(vault: Vault, feature: Feature) {
  if (!vault.features) {
    return true;
  }

  if (vault.features.disable?.includes(feature.name)) {
    return false;
  }

  if (
    vault.features.disable?.includes("*") &&
    !vault.features.enable?.includes(feature.name)
  ) {
    return false;
  }

  return true;
}

function filterOutVaults(vault: VaultWithSubVaults, feature: Feature) {
  if (!shouldKeepVault(vault, feature)) {
    return;
  }

  if (vault.vaults) {
    vault.vaults = vault.vaults.filter((subvault) =>
      filterOutVaults(subvault, feature)
    );
  }

  return vault;
}
