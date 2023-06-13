import { fileExists } from "../../../../util/files.js";
import { VaultWithSubVaults } from "../../../../core/types.js";
import { Alias } from "../../schemas/aliasSchema.js";
import path from "path";
import { PetError } from "../../../../core/PetError.js";

export async function addAliasToConfig({
  newAlias,
  aliases,
  vault,
}: {
  newAlias: Alias;
  aliases: Alias[];
  vault: VaultWithSubVaults;
}) {
  if (aliases.find((x) => x.alias === newAlias.alias)) {
    throw new PetError(`Alias "${newAlias.alias}" already exists`);
  }
  if (!fileExists(path.join(vault.absolutePath, newAlias.relativePath))) {
    throw new PetError(`Note "${newAlias.relativePath}" does not exist`);
  }
  return { aliases: [...aliases, newAlias] };
}
