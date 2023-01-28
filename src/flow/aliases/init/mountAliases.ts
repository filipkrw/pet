import { UserShellData } from "./getUserShellData.js";
import { isZsh } from "./shells/isZsh.js";
import { mountAliasesZsh } from "./zsh/mountAliasesZsh.js";

export async function mountAliases({ shell }: { shell: UserShellData }) {
  const { name, profileFilePath, transformedAliasesFilePath } = shell;

  if (isZsh(name)) {
    mountAliasesZsh({
      zshrcPath: profileFilePath,
      zshAliasesPath: transformedAliasesFilePath,
    });
  }
}
