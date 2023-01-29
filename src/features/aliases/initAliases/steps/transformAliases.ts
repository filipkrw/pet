import { isZsh } from "../zsh/isZsh.js";
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
  const { name } = shell;

  if (isZsh(name)) {
    return {
      transformedAliases: transformAliasesZsh({ loadedAliases }),
    };
  }

  throw new Error(`Unsupported shell: ${name}`);
}
