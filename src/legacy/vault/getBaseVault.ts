import { Vault, VaultWithSubVaults } from "../../features/core/types.js";

export function getBaseVault(vault: VaultWithSubVaults): Vault {
  return {
    absolutePath: vault.absolutePath,
    relativePath: vault.relativePath,
  };
}
