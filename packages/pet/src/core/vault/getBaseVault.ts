import { type VaultWithSubVaults } from "../types.js";

export function getBaseVault(vault: VaultWithSubVaults): {
  absolutePath: string;
  relativePath: string;
} {
  return {
    absolutePath: vault.absolutePath,
    relativePath: vault.relativePath,
  };
}
