import { mountAliasesZsh } from "../zsh/mountAliasesZsh.js";
import { UserShellData } from "./getUserShellData.js";

export async function mountAliases({ shell }: { shell: UserShellData }) {
  const { name, profileFilePath, transformedAliasesFilePath } = shell;

  if (name === "zsh") {
    mountAliasesZsh({
      zshrcPath: profileFilePath,
      zshAliasesPath: transformedAliasesFilePath,
    });
  }
}
