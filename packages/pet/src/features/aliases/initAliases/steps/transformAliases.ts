import { PetError } from "../../../../core/PetError.js";
import { transformAliasesZsh } from "../zsh/transformAliasesZsh.js";
import { UserShellData } from "./getUserShellData.js";
import { LoadedAlias } from "./loadAliasesContent";

export function transformAliases({
  shell,
  loadedAliases,
}: {
  shell: UserShellData;
  loadedAliases: LoadedAlias[];
}) {
  console.log(transformAliasesZsh({ loadedAliases }));

  if (shell.name === "zsh") {
    return {
      transformedAliases: transformAliasesZsh({ loadedAliases }),
    };
  }

  throw new PetError(
    `Alias transformation not supported for shell: ${shell.name}`
  );
}
