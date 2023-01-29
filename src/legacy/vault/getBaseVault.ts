import { Vault, VaultWithSubVaults } from "../../features/types";

export function getBaseVault(vault: VaultWithSubVaults): Vault {
  return {
    absolutePath: vault.absolutePath,
    relativePath: vault.relativePath,
  };
}
