import { PetError } from "../../../../core/PetError.js";
import { VaultWithAliases } from "../../initAliases/steps/loadAliasesConfig.js";

export function removeAliasFromConfig({
  aliasToRemove,
  vaults,
}: {
  aliasToRemove: string;
  vaults: VaultWithAliases[];
}) {
  const parentVault = vaults.find((vault) =>
    vault.aliases?.find((alias) => alias.alias === aliasToRemove)
  );

  if (!parentVault) {
    throw new PetError(`Alias "${aliasToRemove}" not found`);
  }

  return {
    updatedVault: {
      ...parentVault,
      // Do some type inference magic here so `aliases` is not possibly undefined
      aliases: (parentVault.aliases || []).filter(
        (alias) => alias.alias !== aliasToRemove
      ),
    },
  };
}
