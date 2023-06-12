import { type Vault, type VaultWithSubVaults } from "../types.js";

export function getBaseVault(vault: VaultWithSubVaults): Vault {
  return {
    absolutePath: vault.absolutePath,
    relativePath: vault.relativePath,
  };
}
