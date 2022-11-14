import { Vault, VaultWithSubVaults } from "./types";

export function getBaseVault(vault: VaultWithSubVaults): Vault {
  return {
    absolutePath: vault.absolutePath,
    relativePath: vault.relativePath,
  };
}
