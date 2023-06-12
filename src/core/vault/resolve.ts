import { type Vault, type VaultWithSubVaults } from "../types.js";

export async function resolve<T, U>(
  inputVault: VaultWithSubVaults<T>,
  func: (x: Vault<T>) => Promise<Vault<U>>
): Promise<VaultWithSubVaults<U>> {
  const vault = await func(inputVault);

  if (inputVault.vaults) {
    const subVaults = await Promise.all(
      inputVault.vaults.map((subvault) => resolve(subvault, func))
    );
    return {
      ...vault,
      vaults: subVaults,
    };
  }

  return vault;
}
