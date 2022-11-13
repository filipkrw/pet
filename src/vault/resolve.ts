import { type Vault, type VaultWithSubVaults } from "./types.js";

export function resolve<T, U>(
  inputVault: VaultWithSubVaults<T>,
  func: (x: Vault<T>) => Vault<U>
): VaultWithSubVaults<U> {
  const vault = func(inputVault);
  if (inputVault.vaults) {
    const subVaults = inputVault.vaults.map((subvault) =>
      resolve(subvault, func)
    );
    return { ...vault, vaults: subVaults };
  }
  return vault;
}
