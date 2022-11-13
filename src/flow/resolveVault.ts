import * as path from "node:path";
import { BaseConfig, VaultPathsMinimal } from "./types";

export async function resolveVault<T extends BaseConfig, U extends BaseConfig>(
  vault: T,
  resolveFunc: (x: T) => U | Promise<U>
) {
  const resolvedVault = await resolveFunc(vault);
  if (resolvedVault.vaults) {
    const resolvedChildVaults = await Promise.all(
      resolvedVault.vaults.map((childVault) => {
        return resolveFunc(getChildVaultPaths(childVault, vault));
      })
    );
    return {
      ...resolvedVault,
      vaults: resolvedChildVaults,
    };
  }
  return resolvedVault;
}

function getChildVaultPaths(
  childVault: VaultPathsMinimal,
  parentVault: BaseConfig
) {
  if (childVault.absolutePath) {
    return childVault;
  }
  return {
    ...childVault,
    absolutePath: path.join(parentVault.absolutePath, childVault.relativePath),
  };
}
