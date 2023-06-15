import { Vault } from "../types";

export function findParentVault(absolutePath: string, vaults: Vault[]) {
  const parentVault = vaults
    .filter((x) => absolutePath.startsWith(x.absolutePath))
    .sort((a, b) => a.absolutePath.length - b.absolutePath.length)
    .at(-1);

  return parentVault;
}
