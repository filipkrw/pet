import fs from "fs";
import path from "path";
import { VaultWithSubVaults } from "../../../core/types";

export function loadNote({
  vault,
  relativePath,
}: {
  vault: VaultWithSubVaults;
  relativePath: string;
}) {
  const vaultFilePath = path.join(vault.absolutePath, relativePath);
  const vaultFile = fs.readFileSync(vaultFilePath, "utf8");
  return vaultFile;
}
