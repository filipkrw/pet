import { PetError } from "../../../core/PetError.js";
import { Vault } from "../../../core/types.js";
import { findParentVault } from "../../../core/vault/findParentVault.js";

export function findNoteParentVault(
  absolutePath: string,
  vaults: Vault[],
  disabledVaults: Vault[]
) {
  const disabledParentVault = findParentVault(absolutePath, disabledVaults);
  if (disabledParentVault) {
    throw new PetError(
      `Vault is disabled: ${disabledParentVault.absolutePath}`
    );
  }

  const parentVault = findParentVault(absolutePath, vaults);
  if (!parentVault) {
    // This is to make TypeScript happy. This should never happen.
    throw new Error(`Vault not found for path: ${absolutePath}`);
  }

  return parentVault;
}
