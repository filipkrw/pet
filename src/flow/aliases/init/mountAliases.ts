import { UserShellData } from "./getUserShellData.js";
import { isZsh } from "./shells/isZsh.js";
import { mountZsh } from "./zsh/mountZsh.js";

export async function mountAliases({ shell }: { shell: UserShellData }) {
  const { name, profileFilePath, transformedAliasesFilePath } = shell;

  if (isZsh(name)) {
    mountZsh({
      zshrcPath: profileFilePath,
      zshAliasesPath: transformedAliasesFilePath,
    });
  }
}
