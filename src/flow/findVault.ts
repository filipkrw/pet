import { VaultWithSubVaults } from "../vault/types";

export function findVaultByName(
  name: string | undefined,
  vault: VaultWithSubVaults
) {
  if (!name) {
    return vault;
  }
  const foundVault = vault.vaults?.find((x) => x.relativePath === name);
  if (!foundVault) {
    throw new Error(`Vault with name "${name}" not found`);
  }
  return foundVault;
}
