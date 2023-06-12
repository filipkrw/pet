import { Vault, VaultWithSubVaults } from "./types.js";
// @ts-ignore
import treeFlatten from "tree-flatten";

export function flattenVault<T>(vault: VaultWithSubVaults<T>): Vault<T>[] {
  return treeFlatten(vault, "vaults");
}
