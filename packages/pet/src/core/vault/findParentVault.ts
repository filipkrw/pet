import { Vault } from "../types";

export function findParentVault<T>(absolutePath: string, vaults: Vault<T>[]) {
  const parentVault = vaults
    .filter((x) => absolutePath.startsWith(x.absolutePath))
    .sort((a, b) => a.absolutePath.length - b.absolutePath.length)
    .at(-1);

  return parentVault;
}
