import { UserShellData } from "./getUserShellData.js";
import { LoadedAlias } from "./loadAliases";
import { isZsh } from "./shells/isZsh.js";
import { transformAliasesZsh } from "./zsh/transformAliasesZsh.js";

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
