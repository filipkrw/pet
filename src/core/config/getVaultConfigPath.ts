import path from "path";

export function getVaultConfigPath(vaultAbsolutePath: string) {
  return path.join(vaultAbsolutePath, ".pet", "config.mjs");
}
