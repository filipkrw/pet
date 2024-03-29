import { PetError } from "../../../../core/PetError.js";
import { Alias } from "../../schemas/aliasSchema.js";

export function removeAliasFromConfig({
  aliasToRemove,
  aliases,
}: {
  aliasToRemove: string;
  aliases: Alias[];
}) {
  if (!aliases.find((alias) => alias.alias === aliasToRemove)) {
    throw new PetError(`Alias "${aliasToRemove}" not found`);
  }
  return {
    aliases: aliases.filter((alias) => alias.alias !== aliasToRemove),
  };
}
