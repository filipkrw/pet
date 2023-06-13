import path from "path";

export function getAliasesConfigPath(vaultAbsolutePath: string) {
  return path.join(vaultAbsolutePath, ".pet", "aliases.mjs");
}
