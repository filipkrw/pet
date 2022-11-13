import { type Vault, type VaultWithSubVaults } from "./types.js";

export async function resolve<T, U>(
  inputVault: VaultWithSubVaults<T>,
  func: (x: Vault<T>) => Promise<Vault<U>>
): Promise<VaultWithSubVaults<U>> {
  const vault = func(inputVault);

  if (inputVault.vaults) {
    const subVaults = inputVault.vaults.map((subvault) =>
      resolve(subvault, func)
    );
    return {
      ...vault,
      vaults: await Promise.all(subVaults),
    };
  }

  return vault;
}
