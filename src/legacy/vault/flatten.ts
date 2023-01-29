import { Vault, VaultWithSubVaults } from "../../features/types";
// @ts-ignore
import treeFlatten from "tree-flatten";

export function flatten<T>(vault: VaultWithSubVaults<T>): Vault<T>[] {
  return treeFlatten(vault, "vaults");
}
